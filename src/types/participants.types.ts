import { Discipline } from "./disciplines.types.ts";

interface ParticipantDTO {
  id?: number;
  name: string;
  isMale: boolean;
  birthDate: string;
  club: string;
}

interface Participant {
  id: number;
  name: string;
  isMale: boolean;
  birthDate: Date;
  club: string;
}

interface ParticipantWithDisciplines extends Participant {
  disciplines: Discipline[];
}

const newParticipant: ParticipantDTO = {
  name: "",
  isMale: true,
  birthDate: "",
  club: ""
};

export { newParticipant };
export type { Participant, ParticipantDTO, ParticipantWithDisciplines };
