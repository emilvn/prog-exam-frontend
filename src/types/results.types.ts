enum ResultType {
    TIME_IN_SECONDS = "TIME_IN_SECONDS",
    POINTS = "POINTS",
    HEIGHT_IN_METRES = "HEIGHT_IN_METRES",
    LENGTH_IN_METRES = "LENGTH_IN_METRES",
    DISTANCE_IN_METRES = "DISTANCE_IN_METRES"
}

interface ResultDTO {
    id?: number;
    result: number;
    resultType: ResultType;
    participantId: number;
    disciplineId: number;
}

const newResult: ResultDTO = {
    result: 0,
    resultType: ResultType.TIME_IN_SECONDS,
    participantId: 0,
    disciplineId: 0
};

export type { ResultDTO };
export { ResultType, newResult };
