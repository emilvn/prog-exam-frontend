import { Participant, ParticipantWithDisciplines } from "../types/participants.types.ts";
import { getAge } from "../utils/dateUtils.ts";

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

function getAgeGroup(participant: Participant): string {
  const age = getAge(participant.birthDate);
  if (age < 10) {
    return "Børn";
  } else if (age >= 10 && age < 14) {
    return "Unge";
  } else if (age >= 14 && age < 23) {
    return "Junior";
  } else if (age >= 23 && age < 41) {
    return "Voksne";
  } else {
    return "Senior";
  }
}

export { sortParticipants, getAgeGroup };
