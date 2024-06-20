import { Participant, ParticipantWithDisciplines } from "../types/participants.types.ts";

function sortParticipants(
  sortBy: string,
  sortDirection: string,
  participants: ParticipantWithDisciplines[]
): ParticipantWithDisciplines[] {
  const sortedParticipants = [...participants];
  return sortedParticipants.sort((a, b) => {
    if (a[sortBy as keyof Participant] < b[sortBy as keyof Participant]) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (a[sortBy as keyof Participant] > b[sortBy as keyof Participant]) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
}

export { sortParticipants };
