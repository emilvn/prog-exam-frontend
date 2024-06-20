import { Result, ResultType } from "../types/results.types.ts";
import { formatCentimeters, formatMilliseconds } from "../utils/numberUtils.ts";

function sortResultsBestToWorst(results: Result[], resultType: ResultType) {
    const sortedResults = [...results];

    sortedResults.sort((a, b) => b.result - a.result);

    if (resultType === ResultType.TIME_IN_MILLISECONDS) {
        sortedResults.reverse();
    }
    return sortedResults;
}

function formatResult(result: number, resultType: ResultType) {
    if (resultType === ResultType.TIME_IN_MILLISECONDS) {
        return formatMilliseconds(result);
    }
    if (resultType === ResultType.POINTS) {
        return result.toString() + " pt";
    }
    return formatCentimeters(result);
}

function getResultTypeString(resultType: ResultType) {
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

export { sortResultsBestToWorst, formatResult, getResultTypeString };
