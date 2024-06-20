import useResults from "../hooks/useResults.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useDisciplines from "../hooks/useDisciplines.ts";
import { Discipline } from "../types/disciplines.types.ts";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { Result, ResultDTO, ResultType } from "../types/results.types.ts";
import { ParticipantWithDisciplines } from "../types/participants.types.ts";
import {
    formatResult,
    getResultTypeString,
    sortResultsBestToWorst
} from "../helpers/resultHelpers.ts";
import { formatDate, getAge } from "../utils/dateUtils.ts";
import ShowIf from "../components/ShowIf.tsx";
import { LoadingSpinner } from "../components/loading.tsx";
import Modal from "../components/Modal.tsx";

interface ResultModalProps {
    onClose: () => void;
    create: (result: ResultDTO) => void;
    update: (result: Result) => void;
    remove: (result: Result) => void;
    participants: ParticipantWithDisciplines[];
    disciplines: Discipline[];
    selectedResult?: Result;
}

function ResultModal({
    onClose,
    create,
    update,
    remove,
    participants,
    disciplines,
    selectedResult
}: ResultModalProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

    const [selectedParticipant, setSelectedParticipant] = useState<
        ParticipantWithDisciplines | undefined
    >(
        selectedResult?.participantId
            ? participants.find((p) => p.id === selectedResult.participantId)
            : undefined
    );
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | undefined>(
        selectedResult?.disciplineId
            ? disciplines.find((d) => d.id === selectedResult.disciplineId)
            : undefined
    );
    const [result, setResult] = useState<number>(selectedResult?.result ?? 0);
    const [date, setDate] = useState<string>(
        selectedResult?.date.toISOString().split("T")[0] ?? ""
    );

    console.log(selectedDiscipline, selectedParticipant);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedResult) {
            const updatedResult = {
                ...selectedResult,
                participantId: selectedParticipant?.id ?? -1,
                disciplineId: selectedDiscipline?.id ?? -1,
                result: result,
                date: new Date(date)
            };
            update(updatedResult);
            onClose();
        } else {
            const newResult = {
                participantId: selectedParticipant?.id ?? -1,
                disciplineId: selectedDiscipline?.id ?? -1,
                resultType: selectedDiscipline?.resultType ?? ResultType.POINTS,
                result: result,
                date: new Date(date).toISOString()
            };
            create(newResult);
            onClose();
        }
    };

    return (
        <Modal>
            <h1 className={"text-2xl font-semibold"}>
                {selectedResult ? "Redigér Resultat" : "Opret Resultat"}
            </h1>
            <form
                className={"flex flex-col gap-4"}
                onSubmit={onSubmit}
            >
                <label className={"flex flex-col gap-2"}>
                    <span>Dato</span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={"border p-2 rounded"}
                    />
                </label>
                <label className={"flex flex-col gap-2"}>
                    <span>Vælg Disciplin</span>
                    <select
                        value={selectedDiscipline?.id ?? ""}
                        onChange={(e) =>
                            setSelectedDiscipline(
                                disciplines.find((d) => d.id === parseInt(e.target.value))
                            )
                        }
                        className={"border p-2 rounded"}
                    >
                        <option value={""}>Vælg disciplin</option>
                        {disciplines.map((discipline) => (
                            <option
                                key={discipline.id}
                                value={discipline.id}
                            >
                                {discipline.name}
                            </option>
                        ))}
                    </select>
                </label>
                {selectedDiscipline && (
                    <>
                        <label className={"flex flex-col gap-2"}>
                            <span>Vælg Deltager</span>
                            <select
                                value={selectedParticipant?.id ?? ""}
                                onChange={(e) =>
                                    setSelectedParticipant(
                                        participants.find((p) => p.id === parseInt(e.target.value))
                                    )
                                }
                                className={"border p-2 rounded"}
                            >
                                <option value={""}>Vælg deltager</option>
                                {participants
                                    .filter((p) =>
                                        p.disciplines.some((d) => selectedDiscipline.id === d.id)
                                    )
                                    .map((participant) => (
                                        <option
                                            key={participant.id}
                                            value={participant.id}
                                        >
                                            {participant.name}
                                        </option>
                                    ))}
                            </select>
                        </label>
                        <label className={"flex flex-col gap-2"}>
                            <span className={"flex items-center gap-2"}>
                                Resultat
                                <span className={"text-xs text-gray-700"}>
                                    ({getResultTypeString(selectedDiscipline.resultType)})
                                </span>
                            </span>
                            <input
                                type="number"
                                value={result}
                                onChange={(e) => setResult(parseInt(e.target.value))}
                                className={"border p-2 rounded"}
                            />
                        </label>
                    </>
                )}
                <div className={"flex justify-end items-center gap-2"}>
                    <button
                        className={
                            "border rounded-lg bg-gray-500 hover:bg-gray-300 text-white px-4 py-2 font-semibold"
                        }
                        type="button"
                        onClick={onClose}
                    >
                        Luk
                    </button>
                    {selectedResult && (
                        <button
                            className={
                                "border rounded-lg bg-red-500 hover:bg-red-300 text-white px-4 py-2 font-semibold"
                            }
                            type="button"
                            onClick={() => setShowDeleteConfirmation(true)}
                        >
                            Slet
                        </button>
                    )}
                    <button
                        className={
                            "border rounded-lg bg-sky-500 hover:bg-sky-300 text-white px-4 py-2 font-semibold"
                        }
                        type="submit"
                    >
                        Gem
                    </button>
                </div>
            </form>
            {showDeleteConfirmation && (
                <Modal>
                    <h1 className={"text-2xl font-semibold"}>
                        Er du sikker på at du vil slette dette resultat?
                    </h1>
                    <div className={"flex justify-end items-center gap-2"}>
                        <button
                            className={
                                "border rounded-lg bg-gray-500 hover:bg-gray-300 text-white px-4 py-2 font-semibold"
                            }
                            type="button"
                            onClick={() => setShowDeleteConfirmation(false)}
                        >
                            Nej
                        </button>
                        <button
                            className={
                                "border rounded-lg bg-red-500 hover:bg-red-300 text-white px-4 py-2 font-semibold"
                            }
                            type="button"
                            onClick={() => {
                                if (selectedResult) remove(selectedResult);
                                setShowDeleteConfirmation(false);
                                onClose();
                            }}
                        >
                            Ja
                        </button>
                    </div>
                </Modal>
            )}
        </Modal>
    );
}

interface DisciplineGroupProps {
    discipline: Discipline;
    results: Result[];
    participants: ParticipantWithDisciplines[];
    onResultSelect: (result: Result) => void;
}
function DisciplineGroup({
    discipline,
    results,
    participants,
    onResultSelect
}: DisciplineGroupProps) {
    const sortedResults = sortResultsBestToWorst(results, discipline.resultType);
    return (
        <>
            {sortedResults.length > 0 && (
                <div>
                    <h2 className={"bg-sky-300 p-2 font-semibold text-white text-xl px-8"}>
                        {discipline.name}
                    </h2>
                    <table className="w-full">
                        <thead className="text-left border-b">
                            <tr>
                                <th className="w-1/5">Resultat</th>
                                <th className="w-1/5">Navn</th>
                                <th className="w-1/5">Født</th>
                                <th className="w-1/5">Klub</th>
                                <th className="w-1/5">Dato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedResults
                                .filter((result) => result.disciplineId === discipline.id)
                                .map((result) => {
                                    const participant = participants.find(
                                        (p) => p.id === result.participantId
                                    );
                                    return (
                                        <tr
                                            key={result.id}
                                            onClick={() => onResultSelect(result)}
                                            className="border-b cursor-pointer hover:bg-sky-200 font-semibold"
                                            title={"Klik for at redigere resultat"}
                                        >
                                            <td>
                                                {formatResult(result.result, result.resultType)}
                                            </td>
                                            <td>{participant?.name}</td>
                                            <td>{participant?.birthDate.getFullYear()}</td>
                                            <td>{participant?.club}</td>
                                            <td>{formatDate(result.date)}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

interface ResultProps {
    results: Result[];
    participants: ParticipantWithDisciplines[];
    disciplines: Discipline[];
    onResultSelect: (result: Result) => void;
}
function ResultTable({ results, participants, disciplines, onResultSelect }: ResultProps) {
    const groupedResults = disciplines.map((discipline) => ({
        discipline,
        results: results.filter(
            (result) =>
                result.disciplineId === discipline.id &&
                participants.find((p) => p.id === result.participantId)
        )
    }));

    return (
        <div className={"flex flex-col gap-4"}>
            {groupedResults.map(({ discipline, results }) => (
                <DisciplineGroup
                    key={discipline.id}
                    discipline={discipline}
                    results={results}
                    participants={participants}
                    onResultSelect={(result) => onResultSelect(result)}
                />
            ))}
        </div>
    );
}

interface ResultFilterProps {
    disciplines: Discipline[];
    setSelectedDiscipline: Dispatch<SetStateAction<Discipline | undefined>>;
    setSelectedGender: Dispatch<SetStateAction<string>>;
    setSelectedAgeGroup: Dispatch<SetStateAction<string>>;
    setShowResultModal: Dispatch<SetStateAction<boolean>>;
}

function ResultFilter({
    disciplines,
    setSelectedDiscipline,
    setSelectedGender,
    setSelectedAgeGroup,
    setShowResultModal
}: ResultFilterProps) {
    return (
        <div className={"p-4 flex flex-col gap-6"}>
            <div className={"flex justify-between items-center"}>
                <h2 className="text-2xl font-semibold">Resultater</h2>
                <button
                    className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-800 font-semibold"
                    onClick={() => setShowResultModal(true)}
                >
                    Tilføj resultat
                </button>
            </div>
            <div className="flex gap-8 items-center">
                <label className="flex flex-col w-56">
                    <span>Vælg Aldersgruppe</span>
                    <select
                        onChange={(e) => setSelectedAgeGroup(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value={""}>Alle aldersgrupper</option>
                        <option value={"Børn"}>Børn</option>
                        <option value={"Unge"}>Unge</option>
                        <option value={"Junior"}>Junior</option>
                        <option value={"Voksne"}>Voksne</option>
                        <option value={"Senior"}>Senior</option>
                    </select>
                </label>
                <label className="flex flex-col w-56">
                    Vælg disciplin
                    <select
                        onChange={(e) =>
                            setSelectedDiscipline(
                                disciplines.find((d) => d.id === parseInt(e.target.value))
                            )
                        }
                        className="border p-2 rounded"
                    >
                        <option value={0}>Alle discipliner</option>
                        {disciplines.map((discipline) => (
                            <option
                                key={discipline.id}
                                value={discipline.id}
                            >
                                {discipline.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col w-56">
                    Vælg køn
                    <select
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value={""}>Begge køn</option>
                        <option value={"M"}>Mænd</option>
                        <option value={"F"}>Kvinder</option>
                    </select>
                </label>
            </div>
        </div>
    );
}

function Results() {
    const { results, isLoading: resultsLoading, create, update, remove } = useResults();
    const { participants, isLoading: participantsLoading } = useParticipants();
    const { disciplines, isLoading: disciplinesLoading } = useDisciplines();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | undefined>();
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");

    const [filteredResults, setFilteredResults] = useState<Result[]>([]);
    const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithDisciplines[]>(
        []
    );

    const [showResultModal, setShowResultModal] = useState<boolean>(false);
    const [selectedResult, setSelectedResult] = useState<Result | undefined>(undefined);

    useEffect(() => {
        if (!resultsLoading && !participantsLoading && !disciplinesLoading) {
            setIsLoading(false);
        }
    }, [resultsLoading, participantsLoading, disciplinesLoading]);

    useEffect(() => {
        if (selectedDiscipline) {
            setFilteredResults(
                results.filter((result) => result.disciplineId === selectedDiscipline.id)
            );
        } else {
            setFilteredResults(results);
        }
    }, [selectedDiscipline, results]);

    useEffect(() => {
        if (selectedGender === "M") {
            setFilteredParticipants(participants.filter((participant) => participant.isMale));
        } else if (selectedGender === "F") {
            setFilteredParticipants(participants.filter((participant) => !participant.isMale));
        } else {
            setFilteredParticipants(participants);
        }

        if (selectedAgeGroup !== "") {
            setFilteredParticipants(
                participants.filter((participant) => {
                    const age = getAge(participant.birthDate);
                    if (selectedAgeGroup === "Børn") {
                        return age < 10;
                    } else if (selectedAgeGroup === "Unge") {
                        return age >= 10 && age < 14;
                    } else if (selectedAgeGroup === "Junior") {
                        return age >= 14 && age < 23;
                    } else if (selectedAgeGroup === "Voksne") {
                        return age >= 23 && age < 41;
                    } else if (selectedAgeGroup === "Senior") {
                        return age >= 41;
                    }
                    return true;
                })
            );
        }
    }, [selectedGender, participants, selectedAgeGroup]);

    return (
        <>
            <ShowIf condition={isLoading}>
                <div className={"w-full h-96 flex justify-center items-center"}>
                    <LoadingSpinner />
                </div>
            </ShowIf>
            <ShowIf condition={!isLoading}>
                <ResultFilter
                    disciplines={disciplines}
                    setSelectedDiscipline={setSelectedDiscipline}
                    setSelectedGender={setSelectedGender}
                    setSelectedAgeGroup={setSelectedAgeGroup}
                    setShowResultModal={setShowResultModal}
                />
                <ResultTable
                    results={filteredResults}
                    participants={filteredParticipants}
                    disciplines={disciplines}
                    onResultSelect={(result) => {
                        setSelectedResult(result);
                        setShowResultModal(true);
                    }}
                />
                {showResultModal && (
                    <ResultModal
                        onClose={() => {
                            setShowResultModal(false);
                            setSelectedResult(undefined);
                        }}
                        create={create}
                        update={update}
                        remove={remove}
                        participants={participants}
                        disciplines={disciplines}
                        selectedResult={selectedResult}
                    />
                )}
            </ShowIf>
        </>
    );
}

export default Results;