import { Result, ResultDTO } from "../../../types/results.types.ts";
import { ParticipantWithDisciplines } from "../../../types/participants.types.ts";
import { Discipline } from "../../../types/disciplines.types.ts";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Modal from "../../generic/wrappers/Modal.tsx";
import { MdClose } from "react-icons/md";
import {
  getResultTypeStringShort,
  isDistanceResult,
  isPointsResult,
  isTimeResult
} from "../../../helpers/resultHelpers.ts";
import TimeResultInput from "../../generic/inputs/TimeInput.tsx";
import DistanceInput from "../../generic/inputs/DistanceInput.tsx";
import ShowIf from "../../generic/wrappers/ShowIf.tsx";
import DeleteConfirmationModal from "../../generic/modals/DeleteConfirmationModal.tsx";
import Button from "../../generic/Button.tsx";
import MultiSelect from "../../generic/MultiSelect.tsx";

interface MultipleParticipantResultInputProps {
  participants: ParticipantWithDisciplines[];
  date: string;
  selectedDiscipline: Discipline;
  disciplines: Discipline[];
  createMany: (results: ResultDTO[]) => void;
  newResults: ResultDTO[];
  setNewResults: Dispatch<SetStateAction<ResultDTO[]>>;
}

function MultipleParticipantResultInput({
  participants,
  setNewResults,
  date,
  selectedDiscipline
}: MultipleParticipantResultInputProps) {
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithDisciplines[]>(
    participants.filter((p) => p.disciplines.some((d) => d.id === selectedDiscipline?.id))
  );
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
  const [resultValues, setResultValues] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    setFilteredParticipants(
      participants.filter((p) => p.disciplines.some((d) => d.id === selectedDiscipline?.id))
    );
  }, [participants, selectedDiscipline]);

  useEffect(() => {
    if (selectedDiscipline && selectedParticipantIds.length > 0) {
      setNewResults(
        selectedParticipantIds.map((participantId) => ({
          participantId: participantId,
          disciplineId: selectedDiscipline.id ?? -1,
          resultType: selectedDiscipline.resultType,
          result: resultValues.get(participantId) ?? 0,
          date: new Date(date).toISOString()
        }))
      );
    }
  }, [selectedParticipantIds, selectedDiscipline, date, resultValues]);

  return (
    <div className={"w-96"}>
      <span>Vælg Deltagere</span>
      <MultiSelect
        options={filteredParticipants.map((p) => ({ label: p.name, value: p.id }))}
        selectedIds={selectedParticipantIds}
        setSelectedIds={setSelectedParticipantIds}
        placeholder={"Vælg deltagere"}
      />
      {selectedParticipantIds.length > 0 && (
        <div className={"w-96 mt-1 max-h-56 overflow-y-auto"}>
          <table className={"w-full"}>
            <thead className={"text-left"}>
              <tr>
                <th>Deltager</th>
                <th>
                  <span className={"flex items-center gap-1 select-none"}>
                    Resultat
                    <span className={"text-xs text-gray-700"}>
                      ({getResultTypeStringShort(selectedDiscipline?.resultType)})
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedParticipantIds.map((participantId) => (
                <tr
                  key={participantId}
                  className={"text-sm"}
                >
                  <td>{participants.find((p) => p.id === participantId)?.name}</td>
                  <td className={"flex items-center"}>
                    <ShowIf condition={isTimeResult(selectedDiscipline.resultType)}>
                      <TimeResultInput
                        value={resultValues.get(participantId) ?? 0}
                        onValueChange={(res) =>
                          setResultValues(new Map(resultValues.set(participantId, res)))
                        }
                      />
                    </ShowIf>
                    <ShowIf condition={isPointsResult(selectedDiscipline.resultType)}>
                      <input
                        type="number"
                        value={resultValues.get(participantId) ?? 0}
                        onChange={(e) =>
                          setResultValues(
                            new Map(resultValues.set(participantId, Number(e.target.value)))
                          )
                        }
                        className={"border p-2 rounded"}
                      />
                    </ShowIf>
                    <ShowIf condition={isDistanceResult(selectedDiscipline.resultType)}>
                      <DistanceInput
                        value={resultValues.get(participantId) ?? 0}
                        onValueChange={(res) =>
                          setResultValues(new Map(resultValues.set(participantId, res)))
                        }
                      />
                    </ShowIf>
                    <MdClose
                      className={
                        "cursor-pointer bg-red-500 hover:bg-red-300 rounded text-white inline-block h-5 w-5 ml-1"
                      }
                      onClick={() => {
                        setSelectedParticipantIds(
                          selectedParticipantIds.filter((id) => id !== participantId)
                        );
                        setResultValues((prev) => {
                          const newMap = new Map(prev);
                          newMap.delete(participantId);
                          return newMap;
                        });
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
  const [date, setDate] = useState<string>(selectedResult?.date.toISOString().split("T")[0] ?? "");

  const [newResults, setNewResults] = useState<ResultDTO[]>([]);

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
            <ShowIf condition={!!selectedResult}>
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
            </ShowIf>
            <ShowIf condition={!selectedResult && date !== ""}>
              <MultipleParticipantResultInput
                participants={participants}
                disciplines={disciplines}
                selectedDiscipline={selectedDiscipline}
                createMany={createMany}
                newResults={newResults}
                setNewResults={setNewResults}
                date={date}
              />
            </ShowIf>
            {selectedResult && (
              <label className={"flex flex-col gap-2"}>
                <span className={"flex items-center gap-2 select-none"}>
                  Resultat
                  <span className={"text-xs text-gray-700"}>
                    ({getResultTypeStringShort(selectedDiscipline.resultType)})
                  </span>
                </span>
                <ShowIf condition={isTimeResult(selectedDiscipline.resultType)}>
                  <TimeResultInput
                    value={result}
                    onValueChange={(result) => setResult(result)}
                  />
                </ShowIf>
                <ShowIf condition={isPointsResult(selectedResult.resultType)}>
                  <input
                    type="number"
                    value={result}
                    onChange={(e) => setResult(Number(e.target.value))}
                    className={"border p-2 rounded"}
                  />
                </ShowIf>
                <ShowIf condition={isDistanceResult(selectedDiscipline.resultType)}>
                  <DistanceInput
                    value={result}
                    onValueChange={(result) => setResult(result)}
                  />
                </ShowIf>
              </label>
            )}
          </>
        )}
        <div className={"flex justify-end items-center gap-2"}>
          <Button
            text={"Luk"}
            onClick={onClose}
            color={"gray"}
          />
          <ShowIf condition={!!selectedResult}>
            <Button
              text={"Slet"}
              color={"red"}
              onClick={() => setShowDeleteConfirmation(true)}
            />
          </ShowIf>
          <Button
            text={"Gem"}
            color={"green"}
            type={"submit"}
          />
        </div>
      </form>
      <ShowIf condition={showDeleteConfirmation}>
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmation(false)}
          onDelete={() => {
            if (selectedResult) remove(selectedResult);
            onClose();
          }}
          title={"Er du sikker på at du vil slette dette resultat?"}
        />
      </ShowIf>
    </Modal>
  );
}

export default ResultModal;
