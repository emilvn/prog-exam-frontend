enum ResultType {
  TIME_IN_MILLISECONDS = "TIME_IN_MILLISECONDS",
  POINTS = "POINTS",
  HEIGHT_IN_CENTIMETRES = "HEIGHT_IN_CENTIMETRES",
  LENGTH_IN_CENTIMETRES = "LENGTH_IN_CENTIMETRES",
  DISTANCE_IN_CENTIMETRES = "DISTANCE_IN_CENTIMETRES"
}

interface ResultDTO {
  id?: number;
  result: number;
  date: string;
  resultType: ResultType;
  participantId: number;
  disciplineId: number;
}

interface Result {
  id: number;
  result: number;
  date: Date;
  resultType: ResultType;
  participantId: number;
  disciplineId: number;
}

const newResult: ResultDTO = {
  result: 0,
  date: "",
  resultType: ResultType.TIME_IN_MILLISECONDS,
  participantId: 0,
  disciplineId: 0
};

export type { ResultDTO, Result };
export { ResultType, newResult };
