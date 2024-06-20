import { useEffect, useState } from "react";
import type { Result, ResultDTO } from "../types/results.types.ts";
import ResultDataService from "../utils/ResultDataService.ts";
import toast from "react-hot-toast";

function useResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 10;
    const dataService = new ResultDataService();

    const mapDTOToResult = (dto: ResultDTO): Result => {
        return {
            ...dto,
            id: dto.id ?? -1,
            date: new Date(dto.date)
        };
    };

    const mapResultToDTO = (result: Result): ResultDTO => {
        return {
            ...result,
            date: result.date.toISOString()
        };
    };

    const fetchResults = () => {
        return dataService.getAll([
            { value: PAGE_SIZE, key: "size" },
            { value: page, key: "page" }
        ]);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchResults()
            .then((results) => {
                setResults(results.map(mapDTOToResult));
            })
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    toast.error("Failed to fetch results: " + error.message);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [page, PAGE_SIZE]);

    const getResultsByParticipant = (participantId: number) => {
        return dataService
            .getResultsByParticipantId(participantId)
            .then((results) => results.map(mapDTOToResult))
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    toast.error(
                        "Failed to fetch results for participant: " +
                            error.message
                    );
                }
            });
    };

    const getResultsByDiscipline = (disciplineId: number) => {
        return dataService
            .getResultsByDisciplineId(disciplineId)
            .then((results) => results.map(mapDTOToResult))
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    toast.error(
                        "Failed to fetch results for discipline: " +
                            error.message
                    );
                }
            });
    };

    const create = async (result: Result) => {
        try {
            const createdResult = await dataService.create(
                mapResultToDTO(result)
            );
            setResults([...results, mapDTOToResult(createdResult)]);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to create result: " + error.message);
            }
        }
    };

    const update = async (result: Result) => {
        try {
            const updatedResult = await dataService.update(
                mapResultToDTO(result)
            );
            setResults(
                results.map((r) =>
                    r.id === updatedResult.id
                        ? mapDTOToResult(updatedResult)
                        : r
                )
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to update result: " + error.message);
            }
        }
    };

    const remove = async (result: Result) => {
        try {
            await dataService.delete(result.id);
            setResults(results.filter((r) => r.id !== result.id));
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Failed to delete result: " + error.message);
            }
        }
    };

    return {
        results,
        isLoading,
        page,
        setPage,
        create,
        update,
        remove,
        getResultsByParticipant,
        getResultsByDiscipline
    };
}

export default useResults;
