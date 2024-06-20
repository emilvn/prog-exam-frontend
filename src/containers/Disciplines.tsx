import useDisciplines from "../hooks/useDisciplines.ts";
import { LoadingSpinner } from "../components/loading.tsx";
import { Discipline } from "../types/disciplines.types.ts";
import Modal from "../components/Modal.tsx";
import ShowIf from "../components/ShowIf.tsx";
import {
  formatResult,
  getBestResultByDisciplineAndGender,
  getResultTypeStringShort
} from "../helpers/resultHelpers.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useResults from "../hooks/useResults.ts";
import { FormEvent, useState } from "react";
import { ResultType } from "../types/results.types.ts";

interface DisciplineModalProps {
  selectedDiscipline: Discipline | null;
  create: (discipline: Discipline) => void;
  update: (discipline: Discipline) => void;
  onClose: () => void;
}

function DisciplineModal({ selectedDiscipline, create, update, onClose }: DisciplineModalProps) {
  const [name, setName] = useState<string>(selectedDiscipline?.name ?? "");
  const [resultType, setResultType] = useState<ResultType>(
    selectedDiscipline?.resultType ?? ResultType.POINTS
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (selectedDiscipline) {
      update({ ...selectedDiscipline, name, resultType });
    } else {
      create({ name, resultType });
    }
    onClose();
  };

  return (
    <Modal>
      <h2 className={"text-2xl font-semibold"}>
        {selectedDiscipline ? "Rediger" : "Opret"} disciplin
      </h2>
      <form
        onSubmit={onSubmit}
        className={"flex flex-col gap-4"}
      >
        <div className={"flex flex-col space-y-2"}>
          <label className={"flex flex-col"}>
            Navn
            <input
              type={"text"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={"p-2 border rounded"}
            />
          </label>
          <label className={"flex flex-col"}>
            Resultattype
            <select
              value={resultType}
              onChange={(e) => setResultType(e.target.value as ResultType)}
              className={"p-2 border rounded"}
            >
              <option value={ResultType.POINTS}>
                {getResultTypeStringShort(ResultType.POINTS)}
              </option>
              <option value={ResultType.TIME_IN_MILLISECONDS}>
                {getResultTypeStringShort(ResultType.TIME_IN_MILLISECONDS)}
              </option>
              <option value={ResultType.DISTANCE_IN_CENTIMETRES}>
                {getResultTypeStringShort(ResultType.DISTANCE_IN_CENTIMETRES)}
              </option>
              <option value={ResultType.HEIGHT_IN_CENTIMETRES}>
                {getResultTypeStringShort(ResultType.HEIGHT_IN_CENTIMETRES)}
              </option>
              <option value={ResultType.LENGTH_IN_CENTIMETRES}>
                {getResultTypeStringShort(ResultType.LENGTH_IN_CENTIMETRES)}
              </option>
            </select>
          </label>
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
            <button
              className={
                "border rounded-lg bg-sky-500 hover:bg-sky-300 text-white px-4 py-2 font-semibold"
              }
              type="submit"
            >
              Gem
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function Disciplines() {
  const { disciplines, isLoading, create, update } = useDisciplines();
  const { participants } = useParticipants();
  const { results } = useResults();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);

  return (
    <>
      <ShowIf condition={isLoading}>
        <div className={"flex items-center justify-center absolute w-full h-full"}>
          <LoadingSpinner />
        </div>
      </ShowIf>
      <ShowIf condition={!isLoading}>
        <div className={"w-full"}>
          <div className={"flex gap-4 w-full justify-between"}>
            <h2 className={"text-2xl font-semibold p-2"}>Discipliner</h2>
            <button
              className={"bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"}
              onClick={() => setShowModal(true)}
            >
              Tilføj disciplin
            </button>
          </div>
          <table className={"w-full"}>
            <thead className={"text-left"}>
              <tr className={"border-b"}>
                <th className={"p-1"}>Disciplin</th>
                <th>Bedste Resultat Mænd</th>
                <th>Bedste Resultat Kvinder</th>
                <th>Resultattype</th>
              </tr>
            </thead>
            <tbody>
              {disciplines.map((discipline) => (
                <tr
                  key={discipline.id}
                  className={"text-xl border-b hover:bg-sky-300 transition-colors cursor-pointer"}
                  onClick={() => {
                    setSelectedDiscipline(discipline);
                    setShowModal(true);
                  }}
                >
                  <td className={"p-1"}>{discipline.name}</td>
                  <td>
                    {formatResult(
                      getBestResultByDisciplineAndGender(results, discipline, participants, true)
                        .bestResult?.result ?? 0,
                      discipline.resultType
                    )}
                  </td>
                  <td>
                    {formatResult(
                      getBestResultByDisciplineAndGender(results, discipline, participants, false)
                        .bestResult?.result ?? 0,
                      discipline.resultType
                    )}
                  </td>
                  <td>{getResultTypeStringShort(discipline.resultType)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && (
            <DisciplineModal
              selectedDiscipline={selectedDiscipline}
              create={create}
              update={update}
              onClose={() => {
                setShowModal(false);
                setSelectedDiscipline(null);
              }}
            />
          )}
        </div>
      </ShowIf>
    </>
  );
}

export default Disciplines;
