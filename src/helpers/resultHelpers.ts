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

export { sortResultsBestToWorst, formatResult };
