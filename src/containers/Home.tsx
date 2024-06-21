import useResults from "../hooks/useResults.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useDisciplines from "../hooks/useDisciplines.ts";
import { Discipline } from "../types/disciplines.types.ts";
import { useEffect, useState } from "react";
import { Result } from "../types/results.types.ts";
import { ParticipantWithDisciplines } from "../types/participants.types.ts";
import { formatResult } from "../helpers/resultHelpers.ts";
import { formatDate } from "../utils/dateUtils.ts";
import ShowIf from "../components/generic/wrappers/ShowIf.tsx";
import { LoadingSpinner } from "../components/generic/loading.tsx";
import { getAgeGroup } from "../helpers/participantHelpers.ts";
import ResultFilter from "../components/results/ResultFilter.tsx";
import ResultList from "../components/results/ResultList.tsx";

interface LatestResultsProps {
  results: Result[];
  participants: ParticipantWithDisciplines[];
  disciplines: Discipline[];
}

function LatestResults({ results, participants, disciplines }: LatestResultsProps) {
  const sortedResults = results.sort((a, b) => b.date.getTime() - a.date.getTime());
  return (
    <div className={"flex flex-col gap-4 w-80 shadow-lg h-fit pb-3"}>
      <h2 className="text-2xl font-semibold bg-sky-500 rounded-t p-2 text-white text-center">
        Seneste Resultater
      </h2>
      <div className={"p-2"}>
        <table className="w-full">
          <thead className="text-left bg-sky-200">
            <tr>
              <th className="px-1 w-1/5 font-light">Disciplin</th>
              <th className="w-1/5 font-light">Resultat</th>
              <th className="w-1/5 font-light">Navn</th>
              <th className="w-1/5 font-light">Dato</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result) => {
              const discipline = disciplines.find((d) => d.id === result.disciplineId);
              if (!discipline) return null;
              const participant = participants.find((p) => p.id === result.participantId);
              return (
                <tr
                  key={result.id}
                  className={"text-sm odd:bg-gray-100"}
                >
                  <td>{discipline.name}</td>
                  <td>{formatResult(result.result, discipline.resultType)}</td>
                  <td>{participant?.name}</td>
                  <td>{formatDate(result.date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Home() {
  const { results, isLoading: resultsLoading } = useResults();
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
        participants.filter((participant) => selectedAgeGroup === getAgeGroup(participant))
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
        <div>
          <div className={"p-4 flex flex-col gap-6"}>
            <h2 className="text-2xl font-semibold">Rangliste</h2>
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
          />
        </div>
        <LatestResults
          results={results}
          participants={participants}
          disciplines={disciplines}
        />
      </ShowIf>
    </>
  );
}

export default Home;
