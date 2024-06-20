import { Result, ResultType } from "../types/results.types.ts";
import { formatCentimeters, formatMilliseconds } from "../utils/numberUtils.ts";
import { Discipline } from "../types/disciplines.types.ts";
import { Participant } from "../types/participants.types.ts";

function sortResultsBestToWorst(results: Result[], resultType: ResultType) {
  const sortedResults = [...results];

  sortedResults.sort((a, b) => b.result - a.result);

  if (resultType === ResultType.TIME_IN_MILLISECONDS) {
    sortedResults.reverse();
  }
  return sortedResults;
}

function formatResult(result: number, resultType: ResultType) {
  if (result === 0) return "-";
  if (resultType === ResultType.TIME_IN_MILLISECONDS) {
    return formatMilliseconds(result);
  }
  if (resultType === ResultType.POINTS) {
    return result.toString() + " pt";
  }
  return formatCentimeters(result);
}

function getResultTypeStringLong(resultType: ResultType) {
  switch (resultType) {
    case ResultType.TIME_IN_MILLISECONDS:
      return "Tid i millisekunder";
    case ResultType.POINTS:
      return "Point";
    case ResultType.DISTANCE_IN_CENTIMETRES:
      return "Distance i centimeter";
    case ResultType.HEIGHT_IN_CENTIMETRES:
      return "Højde i centimeter";
    case ResultType.LENGTH_IN_CENTIMETRES:
      return "Længde i centimeter";
    default:
      return "";
  }
}

function getResultTypeStringShort(resultType: ResultType) {
  switch (resultType) {
    case ResultType.TIME_IN_MILLISECONDS:
      return "Tid";
    case ResultType.POINTS:
      return "Point";
    case ResultType.DISTANCE_IN_CENTIMETRES:
      return "Distance";
    case ResultType.HEIGHT_IN_CENTIMETRES:
      return "Højde";
    case ResultType.LENGTH_IN_CENTIMETRES:
      return "Længde";
    default:
      return "";
  }
}

function getBestResultByDisciplineAndGender(
  results: Result[],
  discipline: Discipline,
  participants: Participant[],
  isMale: boolean
) {
  const sortedResults = sortResultsBestToWorst(
    results
      .filter((r) => r.disciplineId === discipline.id)
      .filter((r) => {
        const participant = participants.find((p) => p.id === r.participantId);
        return participant?.isMale === isMale;
      }),
    discipline.resultType
  );
  const bestResult = sortedResults[0];
  const participant = participants.find(
    (participant) => participant.id === bestResult?.participantId
  );
  return { bestResult, participant };
}

export {
  sortResultsBestToWorst,
  formatResult,
  getResultTypeStringLong,
  getBestResultByDisciplineAndGender,
  getResultTypeStringShort
};
