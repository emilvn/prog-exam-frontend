import { ParticipantWithDisciplines } from "../types/participants.types.ts";
import { useEffect, useState } from "react";
import { getAgeGroup } from "../helpers/participantHelpers.ts";
import { formatResult, getBestResultByDisciplineAndGender } from "../helpers/resultHelpers.ts";
import useResults from "../hooks/useResults.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useDisciplines from "../hooks/useDisciplines.ts";
import { LoadingSpinner } from "./loading.tsx";
import ShowIf from "./ShowIf.tsx";

function BestResults() {
  const { results, isLoading: resultsLoading } = useResults();
  const { participants, isLoading: participantsLoading } = useParticipants();
  const { disciplines, isLoading: disciplinesLoading } = useDisciplines();

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithDisciplines[]>(
    []
  );

  useEffect(() => {
    if (selectedAgeGroup !== "") {
      setFilteredParticipants(
        participants.filter((participant) => selectedAgeGroup === getAgeGroup(participant))
      );
    } else {
      setFilteredParticipants(participants);
    }
  }, [selectedAgeGroup, participants]);

  return (
    <div className={"flex flex-col gap-4 min-w-80 shadow-lg h-fit pb-3"}>
      <h2 className="text-2xl font-semibold bg-sky-500 rounded-t-lg p-2 text-white text-center">
        Bedste Resultater
      </h2>
      <ShowIf condition={resultsLoading || participantsLoading || disciplinesLoading}>
        <div className={"w-full mt-8 flex justify-center items-center"}>
          <LoadingSpinner />
        </div>
      </ShowIf>
      <ShowIf condition={!resultsLoading && !participantsLoading && !disciplinesLoading}>
        <label className="flex flex-col ml-4 mr-8">
          <span className={"italic text-sm"}>Vælg Aldersgruppe</span>
          <select
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="border p-1 rounded"
          >
            <option value={""}>Alle aldersgrupper</option>
            <option value={"Børn"}>Børn</option>
            <option value={"Unge"}>Unge</option>
            <option value={"Junior"}>Junior</option>
            <option value={"Voksne"}>Voksne</option>
            <option value={"Senior"}>Senior</option>
          </select>
        </label>
        <div className={"p-2"}>
          <h3 className={"text-base font-semibold"}>Mænd</h3>
          <table className="w-full">
            <thead className="text-left bg-sky-200">
              <tr>
                <th className="px-1 w-1/5 font-light">Disciplin</th>
                <th className="w-1/5 font-light">Resultat</th>
                <th className="w-1/5 font-light">Navn</th>
              </tr>
            </thead>
            <tbody>
              {disciplines.map((discipline) => {
                const { bestResult, participant } = getBestResultByDisciplineAndGender(
                  results,
                  discipline,
                  filteredParticipants,
                  true
                );
                return (
                  <tr
                    key={discipline.id}
                    className={"text-sm odd:bg-gray-100"}
                  >
                    <td>{discipline.name}</td>
                    <td>{formatResult(bestResult?.result, discipline.resultType)}</td>
                    <td>{participant?.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h3 className={"text-base font-semibold mt-4"}>Kvinder</h3>
          <table className="w-full">
            <thead className="text-left  bg-sky-200">
              <tr>
                <th className="px-1 w-1/5 font-light">Disciplin</th>
                <th className="w-1/5 font-light">Resultat</th>
                <th className="w-1/5 font-light">Navn</th>
              </tr>
            </thead>
            <tbody>
              {disciplines.map((discipline) => {
                const { bestResult, participant } = getBestResultByDisciplineAndGender(
                  results,
                  discipline,
                  filteredParticipants,
                  false
                );
                return (
                  <tr
                    key={discipline.id}
                    className={"text-sm odd:bg-gray-100"}
                  >
                    <td>{discipline.name}</td>
                    <td>{formatResult(bestResult?.result, discipline.resultType)}</td>
                    <td>{participant?.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ShowIf>
    </div>
  );
}

export default BestResults;
