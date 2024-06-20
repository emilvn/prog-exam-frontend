import useParticipants from "../hooks/useParticipants.ts";
import { useEffect, useState } from "react";
import type { ParticipantWithDisciplines } from "../types/participants.types.ts";

interface ParticipantsProps {
    search?: string;
}

function Participants({ search }: ParticipantsProps) {
    const { participants } = useParticipants();
    const [filteredParticipants, setFilteredParticipants] = useState<
        ParticipantWithDisciplines[]
    >([]);

    useEffect(() => {
        if (search && search !== "") {
            setFilteredParticipants(
                participants.filter((participant) =>
                    participant.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
            );
        } else {
            setFilteredParticipants(participants);
        }
    }, [search, participants]);

    return (
        <div>
            <h1>Participants</h1>
            <ul>
                {filteredParticipants.map((participant) => (
                    <li key={participant.id}>{participant.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Participants;
