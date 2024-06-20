import { ResultType } from "./results.types.ts";

interface Discipline {
  id?: number;
  name: string;
  resultType: ResultType;
}

const newDiscipline: Discipline = {
  name: "",
  resultType: ResultType.TIME_IN_MILLISECONDS
};

export type { Discipline };
export { newDiscipline };
