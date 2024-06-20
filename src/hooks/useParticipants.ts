import { useEffect, useState } from "react";

import type {
    Participant,
    ParticipantDTO,
    ParticipantWithDisciplines
} from "../types/participants.types.ts";
import ParticipantDataService from "../utils/ParticipantDataService.ts";
import toast from "react-hot-toast";

function useParticipants() {
    const [participants, setParticipants] = useState<
        ParticipantWithDisciplines[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 10;

    const participantDataService = new ParticipantDataService();

    const mapDTOToParticipant = (
        participantDTO: ParticipantDTO
    ): Participant => {
        return {
            ...participantDTO,
            id: participantDTO.id ?? -1,
            birthDate: new Date(participantDTO.birthDate)
        };
    };

    const mapParticipantToDTO = (participant: Participant): ParticipantDTO => {
        return {
            ...participant,
            birthDate: participant.birthDate.toISOString()
        };
    };

    const fetchParticipants = () => {
        return participantDataService.getAll([
            { key: "size", value: PAGE_SIZE },
            { key: "page", value: page }
        ]);
    };

    const fetchParticipantDisciplines = (participant: Participant) => {
        return participantDataService.getDisciplines(participant.id);
    };

    const getParticipantWithDisciplines = async () => {
        const participants = (await fetchParticipants()).map(
            mapDTOToParticipant
        );
        const participantsWithDisciplines: ParticipantWithDisciplines[] =
            await Promise.all(
                participants.map(async (participant) => {
                    const disciplines =
                        await fetchParticipantDisciplines(participant);
                    return { ...participant, disciplines };
                })
            );
        return participantsWithDisciplines;
    };

    useEffect(() => {
        setIsLoading(true);
        getParticipantWithDisciplines()
            .then((data) => setParticipants(data))
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    toast.error(
                        "Failed to fetch participants: " + error.message
                    );
                }
            })
            .finally(() => setIsLoading(false));
    }, [page, PAGE_SIZE]);

    const create = async (participant: ParticipantDTO) => {
        try {
            const newParticipantDTO =
                await participantDataService.create(participant);

            const newParticipant = mapDTOToParticipant(newParticipantDTO);
            const disciplines =
                await fetchParticipantDisciplines(newParticipant);

            setParticipants([
                ...participants,
                { ...newParticipant, disciplines }
            ]);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to create participant: " + error.message);
            }
        }
    };

    const update = async (participant: Participant) => {
        try {
            const updatedParticipantDTO = await participantDataService.update(
                mapParticipantToDTO(participant)
            );

            const updatedParticipant = mapDTOToParticipant(
                updatedParticipantDTO
            );
            const disciplines =
                await fetchParticipantDisciplines(updatedParticipant);

            setParticipants(
                participants.map((p) =>
                    p.id === updatedParticipant.id
                        ? { ...updatedParticipant, disciplines }
                        : p
                )
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to update participant: " + error.message);
            }
        }
    };

    const remove = async (participant: Participant) => {
        try {
            await participantDataService.delete(participant.id);
            setParticipants(
                participants.filter((p) => p.id !== participant.id)
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to remove participant: " + error.message);
            }
        }
    };

    const addDiscipline = async (
        disciplineId: number,
        participant: Participant
    ) => {
        try {
            const disciplines = await participantDataService.addDiscipline(
                participant.id,
                disciplineId
            );

            setParticipants(
                participants.map((p) =>
                    p.id === participant.id
                        ? { ...participant, disciplines }
                        : p
                )
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to add discipline: " + error.message);
            }
        }
    };

    const removeDiscipline = async (
        disciplineId: number,
        participant: Participant
    ) => {
        try {
            const disciplines = await participantDataService.removeDiscipline(
                participant.id,
                disciplineId
            );

            setParticipants(
                participants.map((p) =>
                    p.id === participant.id
                        ? { ...participant, disciplines }
                        : p
                )
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to remove discipline: " + error.message);
            }
        }
    };

    return {
        participants,
        create,
        update,
        remove,
        addDiscipline,
        removeDiscipline,
        isLoading,
        page,
        setPage
    };
}

export default useParticipants;
