import useResults from "../hooks/useResults.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useDisciplines from "../hooks/useDisciplines.ts";
import { Discipline } from "../types/disciplines.types.ts";
import { FormEvent, useEffect, useState } from "react";
import { Result, ResultDTO, ResultType } from "../types/results.types.ts";
import { ParticipantWithDisciplines } from "../types/participants.types.ts";
import { getResultTypeStringShort } from "../helpers/resultHelpers.ts";
import { getAge } from "../utils/dateUtils.ts";
import ShowIf from "../components/generic/ShowIf.tsx";
import { LoadingSpinner } from "../components/generic/loading.tsx";
import Modal from "../components/generic/Modal.tsx";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import ResultFilter from "../components/results/ResultFilter.tsx";
import ResultList from "../components/results/ResultList.tsx";

interface DistanceInputProps {
  result: number;
  onResultChange: (result: number) => void;
}

function DistanceInput({ result, onResultChange }: DistanceInputProps) {
  const [centimetres, setCentimetres] = useState<number>(0);
  const [metres, setMetres] = useState<number>(0);

  useEffect(() => {
    setCentimetres(result % 100);
    setMetres(Math.floor(result / 100));
  }, []);

  useEffect(() => {
    onResultChange(metres * 100 + centimetres);
  }, [metres, centimetres]);

  return (
    <div className={"flex gap-1"}>
      <input
        type="number"
        value={metres}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setMetres(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setMetres(0);
            return;
          }
          setMetres(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>m</span>
      <input
        type="number"
        value={centimetres}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setCentimetres(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setCentimetres(0);
            return;
          }
          setCentimetres(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>cm</span>
    </div>
  );
}

interface TimeResultInputProps {
  result: number;
  onResultChange: (result: number) => void;
}

function TimeResultInput({ result, onResultChange }: TimeResultInputProps) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [milliseconds, setMilliseconds] = useState<number>(0);

  useEffect(() => {
    setHours(Math.floor(result / 3600000));
    setMinutes(Math.floor((result % 3600000) / 60000));
    setSeconds(Math.floor((result % 60000) / 1000));
    setMilliseconds(result % 1000);
  }, []);

  useEffect(() => {
    onResultChange(hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds);
  }, [hours, minutes, seconds, milliseconds]);

  return (
    <div className={"flex gap-2 w-56"}>
      <input
        type="number"
        value={hours}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setHours(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setHours(0);
            return;
          }
          setHours(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>:</span>
      <input
        type="number"
        value={minutes}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setMinutes(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setMinutes(0);
            return;
          }
          setMinutes(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>:</span>
      <input
        type="number"
        value={seconds}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setSeconds(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setSeconds(0);
            return;
          }
          setSeconds(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>,</span>
      <input
        type="number"
        value={milliseconds}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setMilliseconds(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setMilliseconds(0);
            return;
          }
          setMilliseconds(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
    </div>
  );
}

interface ResultModalProps {
  onClose: () => void;
  createMany: (results: ResultDTO[]) => void;
  update: (result: Result) => void;
  remove: (result: Result) => void;
  participants: ParticipantWithDisciplines[];
  disciplines: Discipline[];
  selectedResult?: Result;
}

function ResultModal({
  onClose,
  createMany,
  update,
  remove,
  participants,
  disciplines,
  selectedResult
}: ResultModalProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedParticipant, setSelectedParticipant] = useState<
    ParticipantWithDisciplines | undefined
  >(
    selectedResult?.participantId
      ? participants.find((p) => p.id === selectedResult.participantId)
      : undefined
  );
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantWithDisciplines[]>(
    []
  );

  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | undefined>(
    selectedResult?.disciplineId
      ? disciplines.find((d) => d.id === selectedResult.disciplineId)
      : undefined
  );
  const [result, setResult] = useState<number>(selectedResult?.result ?? 0);
  const [date, setDate] = useState<string>(selectedResult?.date.toISOString().split("T")[0] ?? "");
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithDisciplines[]>(
    participants.filter((p) => p.disciplines.some((d) => d.id === selectedDiscipline?.id))
  );
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [newResults, setNewResults] = useState<ResultDTO[]>([]);

  useEffect(() => {
    setFilteredParticipants(
      participants
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .filter((p) => p.disciplines.some((d) => d.id === selectedDiscipline?.id))
    );
  }, [search, participants, selectedDiscipline]);

  useEffect(() => {
    if (selectedDiscipline && selectedParticipants.length > 0) {
      setNewResults(
        selectedParticipants.map((participant) => ({
          participantId: participant.id,
          disciplineId: selectedDiscipline?.id ?? -1,
          resultType: selectedDiscipline?.resultType ?? ResultType.TIME_IN_MILLISECONDS,
          result: 0,
          date: new Date(date).toISOString()
        }))
      );
    }
  }, [selectedParticipants, selectedDiscipline, date]);

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
      createMany(newResults.filter((r) => r.result !== 0));
      onClose();
    }
  };

  return (
    <Modal>
      <h1 className={"text-2xl font-semibold"}>
        {selectedResult ? "Redigér Resultat" : "Opret Resultater"}
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
              setSelectedDiscipline(disciplines.find((d) => d.id === parseInt(e.target.value)))
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
            {selectedResult && (
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
                    .filter((p) => p.disciplines.some((d) => selectedDiscipline.id === d.id))
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
            )}
            {!selectedResult && (
              <div className={"w-96"}>
                <span>Vælg Deltagere</span>
                <div className={"w-80 relative border rounded-lg py-2"}>
                  <div className={"px-4 flex items-center justify-between"}>
                    <input
                      placeholder={"Vælg Deltagere"}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={"focus:ring-transparent outline-none"}
                      onClick={() => setShowOptions(true)}
                    />
                    <div
                      className={"cursor-pointer h-6 w-6 flex justify-center items-center"}
                      onClick={() => setShowOptions(!showOptions)}
                    >
                      <MdKeyboardArrowDown />
                    </div>
                  </div>
                  {showOptions && (
                    <div
                      className={
                        "flex flex-col absolute bg-white border rounded-b z-50 w-full max-h-48 overflow-y-auto"
                      }
                    >
                      {filteredParticipants.length > 0 &&
                        filteredParticipants.map((participant) => {
                          const isParticipantSelected = selectedParticipants.some(
                            (p) => p.id === participant.id
                          );
                          return (
                            <button
                              key={participant.id}
                              className={
                                "border-b px-4 py-2 hover:bg-sky-300 flex justify-between font-semibold" +
                                (isParticipantSelected ? " bg-sky-500 text-white" : "")
                              }
                              onClick={() => {
                                if (isParticipantSelected) {
                                  setSelectedParticipants((prev) =>
                                    prev.filter((p) => p.id !== participant.id)
                                  );
                                } else {
                                  setSelectedParticipants((prev) => [...prev, participant]);
                                }
                              }}
                              type={"button"}
                            >
                              {participant.name}
                              {isParticipantSelected && <MdClose className={"inline-block"} />}
                            </button>
                          );
                        })}
                      {filteredParticipants.length === 0 && (
                        <div className={"px-4 py-2 italic text-gray-500"}>
                          Der blev ikke fundet nogen deltagere
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedParticipants.length > 0 && (
                  <div className={"w-96 mt-1 max-h-56 overflow-y-auto"}>
                    <table className={"w-full"}>
                      <thead className={"text-left"}>
                        <tr>
                          <th>Deltager</th>
                          <th>
                            <span className={"flex items-center gap-1 select-none"}>
                              Resultat
                              <span className={"text-xs text-gray-700"}>
                                ({getResultTypeStringShort(selectedDiscipline.resultType)})
                              </span>
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedParticipants.map((participant) => (
                          <tr
                            key={participant.id}
                            className={"text-sm"}
                          >
                            <td>{participant.name}</td>
                            <td className={"flex items-center"}>
                              {selectedDiscipline.resultType ===
                                ResultType.TIME_IN_MILLISECONDS && (
                                <TimeResultInput
                                  result={
                                    newResults.find((r) => r.participantId === participant.id)
                                      ?.result ?? 0
                                  }
                                  onResultChange={(res) =>
                                    setNewResults((prev) =>
                                      prev.map((r) =>
                                        r.participantId === participant.id
                                          ? {
                                              ...r,
                                              result: res
                                            }
                                          : r
                                      )
                                    )
                                  }
                                />
                              )}
                              {selectedDiscipline.resultType === ResultType.POINTS && (
                                <input
                                  type="number"
                                  value={
                                    newResults.find((r) => r.participantId === participant.id)
                                      ?.result ?? 0
                                  }
                                  onChange={(e) =>
                                    setNewResults((prev) =>
                                      prev.map((r) =>
                                        r.participantId === participant.id
                                          ? {
                                              ...r,
                                              result: Number(e.target.value)
                                            }
                                          : r
                                      )
                                    )
                                  }
                                  className={"border p-2 rounded"}
                                />
                              )}
                              {(selectedDiscipline.resultType ===
                                ResultType.DISTANCE_IN_CENTIMETRES ||
                                selectedDiscipline.resultType ===
                                  ResultType.HEIGHT_IN_CENTIMETRES ||
                                selectedDiscipline.resultType ===
                                  ResultType.LENGTH_IN_CENTIMETRES) && (
                                <DistanceInput
                                  result={
                                    newResults.find((r) => r.participantId === participant.id)
                                      ?.result ?? 0
                                  }
                                  onResultChange={(res) =>
                                    setNewResults((prev) =>
                                      prev.map((r) =>
                                        r.participantId === participant.id
                                          ? {
                                              ...r,
                                              result: res
                                            }
                                          : r
                                      )
                                    )
                                  }
                                />
                              )}
                              <MdClose
                                className={
                                  "cursor-pointer bg-red-500 hover:bg-red-300 rounded text-white inline-block h-5 w-5 ml-1"
                                }
                                onClick={() => {
                                  setSelectedParticipants((prev) =>
                                    prev.filter((p) => p.id !== participant.id)
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {selectedResult && (
              <label className={"flex flex-col gap-2"}>
                <span className={"flex items-center gap-2 select-none"}>
                  Resultat
                  <span className={"text-xs text-gray-700"}>
                    ({getResultTypeStringShort(selectedDiscipline.resultType)})
                  </span>
                </span>
                {selectedDiscipline.resultType === ResultType.TIME_IN_MILLISECONDS && (
                  <TimeResultInput
                    result={result}
                    onResultChange={(result) => setResult(result)}
                  />
                )}
                {selectedDiscipline.resultType === ResultType.POINTS && (
                  <input
                    type="number"
                    value={result}
                    onChange={(e) => setResult(Number(e.target.value))}
                    className={"border p-2 rounded"}
                  />
                )}
                {(selectedDiscipline.resultType === ResultType.DISTANCE_IN_CENTIMETRES ||
                  selectedDiscipline.resultType === ResultType.HEIGHT_IN_CENTIMETRES ||
                  selectedDiscipline.resultType === ResultType.LENGTH_IN_CENTIMETRES) && (
                  <DistanceInput
                    result={result}
                    onResultChange={(result) => setResult(result)}
                  />
                )}
              </label>
            )}
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

function Results() {
  const { results, isLoading: resultsLoading, createMany, update, remove } = useResults();
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
      setFilteredResults(results.filter((result) => result.disciplineId === selectedDiscipline.id));
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
        <div className={"w-full"}>
          <div className={"p-4 flex flex-col gap-6"}>
            <div className={"flex justify-between items-center"}>
              <h2 className="text-2xl font-semibold">Resultater</h2>
              <button
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                onClick={() => setShowResultModal(true)}
              >
                Tilføj resultat
              </button>
            </div>
            <ResultFilter
              disciplines={disciplines}
              setSelectedDiscipline={setSelectedDiscipline}
              setSelectedGender={setSelectedGender}
              setSelectedAgeGroup={setSelectedAgeGroup}
            />
          </div>
          <ResultList
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
              createMany={createMany}
              update={update}
              remove={remove}
              participants={participants}
              disciplines={disciplines}
              selectedResult={selectedResult}
            />
          )}
        </div>
      </ShowIf>
    </>
  );
}

export default Results;
