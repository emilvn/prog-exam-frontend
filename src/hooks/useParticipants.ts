import { useEffect, useState } from "react";

import type {
    Participant,
    ParticipantDTO,
    ParticipantWithDisciplines
} from "../types/participants.types.ts";
import ParticipantDataService from "../utils/ParticipantDataService.ts";
import toast from "react-hot-toast";

function useParticipants() {
    const [participants, setParticipants] = useState<ParticipantWithDisciplines[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const participantDataService = new ParticipantDataService();

    const mapDTOToParticipant = (participantDTO: ParticipantDTO): Participant => {
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
        return participantDataService.getAll();
    };

    const fetchParticipantDisciplines = (participant: Participant) => {
        return participantDataService.getDisciplines(participant.id);
    };

    const getParticipantWithDisciplines = async () => {
        const participants = (await fetchParticipants()).map(mapDTOToParticipant);
        const participantsWithDisciplines: ParticipantWithDisciplines[] = await Promise.all(
            participants.map(async (participant) => {
                const disciplines = await fetchParticipantDisciplines(participant);
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
                    toast.error("Failed to fetch participants: " + error.message);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const create = async (participant: ParticipantDTO) => {
        try {
            const newParticipantDTO = await participantDataService.create(participant);

            const newParticipant = mapDTOToParticipant(newParticipantDTO);
            const disciplines = await fetchParticipantDisciplines(newParticipant);

            setParticipants([...participants, { ...newParticipant, disciplines }]);
            toast.success("Participant created successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to create selectedParticipant: " + error.message);
            }
        }
    };

    const update = async (participant: Participant) => {
        try {
            const updatedParticipantDTO = await participantDataService.update(
                mapParticipantToDTO(participant),
                participant.id
            );
            console.log(updatedParticipantDTO);
            const updatedParticipant = mapDTOToParticipant(updatedParticipantDTO);
            const disciplines = await fetchParticipantDisciplines(updatedParticipant);

            setParticipants(
                participants.map((p) =>
                    p.id === updatedParticipant.id ? { ...updatedParticipant, disciplines } : p
                )
            );
            toast.success("Participant updated successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to update selectedParticipant: " + error.message);
            }
        }
    };

    const remove = async (participant: Participant) => {
        try {
            await participantDataService.delete(participant.id);
            setParticipants(participants.filter((p) => p.id !== participant.id));
            toast.success("Participant removed successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to remove selectedParticipant: " + error.message);
            }
        }
    };

    const addDisciplines = async (disciplineIds: number[], participant: Participant) => {
        try {
            const promises = await Promise.all(
                disciplineIds.map((id) => participantDataService.addDiscipline(participant.id, id))
            );
            const disciplines = promises[promises.length - 1];
            setParticipants(
                participants.map((p) =>
                    p.id === participant.id ? { ...participant, disciplines } : p
                )
            );
            toast.success("Disciplines added successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to add disciplines: " + error.message);
            }
        }
    };

    const removeDisciplines = async (disciplineIds: number[], participant: Participant) => {
        try {
            const promises = await Promise.all(
                disciplineIds.map((id) =>
                    participantDataService.removeDiscipline(participant.id, id)
                )
            );
            const disciplines = promises[promises.length - 1];

            setParticipants(
                participants.map((p) =>
                    p.id === participant.id ? { ...participant, disciplines } : p
                )
            );
            toast.success("Disciplines removed successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to remove disciplines: " + error.message);
            }
        }
    };

    return {
        participants,
        create,
        update,
        remove,
        addDisciplines,
        removeDisciplines,
        isLoading
    };
}

export default useParticipants;
