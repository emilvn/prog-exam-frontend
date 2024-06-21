import { ParticipantWithDisciplines } from "../../../types/participants.types.ts";
import useResults from "../../../hooks/useResults.ts";
import useDisciplines from "../../../hooks/useDisciplines.ts";
import { useEffect, useState } from "react";
import { Result } from "../../../types/results.types.ts";
import toast from "react-hot-toast";
import Modal from "../../generic/wrappers/Modal.tsx";
import ShowIf from "../../generic/wrappers/ShowIf.tsx";
import { LoadingSpinner } from "../../generic/loading.tsx";
import { getAgeGroup } from "../../../helpers/participantHelpers.ts";
import { formatResult } from "../../../helpers/resultHelpers.ts";
import { formatDate } from "../../../utils/dateUtils.ts";

interface ParticipantResultModalProps {
  participant: ParticipantWithDisciplines;
  onClose: () => void;
}

function ParticipantResultModal({ participant, onClose }: ParticipantResultModalProps) {
  const { getResultsByParticipant } = useResults();
  const { disciplines, isLoading: disciplinesLoading } = useDisciplines();
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(disciplinesLoading);

  useEffect(() => {
    setIsLoading(true);
    getResultsByParticipant(participant.id)
      .then((results) => setResults(results))
      .catch((error: unknown) => {
        if (error instanceof Error) {
          toast.error("Failed to fetch results: " + error.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [participant]);

  return (
    <Modal>
      <ShowIf condition={isLoading}>
        <div className={"flex justify-center items-center w-full h-96"}>
          <LoadingSpinner />
        </div>
      </ShowIf>
      <ShowIf condition={!isLoading}>
        <div className={"flex items-end justify-between border-b p-2"}>
          <h1 className={"text-2xl font-semibold mt-2"}>{participant.name}</h1>
          <span className={"text-gray-500 text-sm"}>
            {participant.club} - {getAgeGroup(participant)}
          </span>
        </div>
        <span className={"block mt-2 font-semibold"}>Discipliner</span>
        <ShowIf condition={participant.disciplines.length > 0}>
          <div className={"flex flex-wrap gap-1 max-w-96"}>
            {participant.disciplines.map((discipline) => (
              <div
                key={discipline.id}
                className={"p-1 bg-sky-500 text-white text-sm font-light rounded-lg mt-2"}
              >
                {discipline.name}
              </div>
            ))}
          </div>
        </ShowIf>
        <span className={"block mt-2 font-semibold"}>Resultater</span>
        <div className={"h-80 overflow-y-auto"}>
          <table className={"w-full my-2"}>
            <thead className={"bg-sky-300 text-white text-left"}>
              <tr>
                <th className={"p-1"}>Disciplin</th>
                <th className={"p-1"}>Resultat</th>
                <th className={"p-1"}>Dato</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 &&
                results.map((result) => (
                  <tr
                    key={result.id}
                    className={"border-b"}
                  >
                    <td>{disciplines.find((d) => d.id === result.disciplineId)?.name}</td>
                    <td>{formatResult(result.result, result.resultType)}</td>
                    <td>{formatDate(result.date)}</td>
                  </tr>
                ))}
              {results.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className={"text-center italic text-gray-500 border-b p-4"}
                  >
                    Ingen resultater fundet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
        </div>
      </ShowIf>
    </Modal>
  );
}

export default ParticipantResultModal;
