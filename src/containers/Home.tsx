import useResults from "../hooks/useResults.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useDisciplines from "../hooks/useDisciplines.ts";
import { Discipline } from "../types/disciplines.types.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Result } from "../types/results.types.ts";
import { ParticipantWithDisciplines } from "../types/participants.types.ts";
import { formatResult, sortResultsBestToWorst } from "../helpers/resultHelpers.ts";
import { formatDate } from "../utils/dateUtils.ts";
import ShowIf from "../components/ShowIf.tsx";
import { LoadingSpinner } from "../components/loading.tsx";
import { getAgeGroup } from "../helpers/participantHelpers.ts";

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

interface DisciplineGroupProps {
  discipline: Discipline;
  results: Result[];
  participants: ParticipantWithDisciplines[];
}

function DisciplineGroup({ discipline, results, participants }: DisciplineGroupProps) {
  const sortedResults = sortResultsBestToWorst(results, discipline.resultType);
  return (
    <>
      {sortedResults.length > 0 && (
        <div>
          <h2 className={"bg-sky-300 font-semibold text-white text-xl px-8 py-1"}>
            {discipline.name}
          </h2>
          <table className="w-full">
            <thead className="text-left">
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
                  const participant = participants.find((p) => p.id === result.participantId);
                  return (
                    <tr key={result.id}>
                      <td>{formatResult(result.result, result.resultType)}</td>
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

interface RankingProps {
  results: Result[];
  participants: ParticipantWithDisciplines[];
  disciplines: Discipline[];
}

function Ranking({ results, participants, disciplines }: RankingProps) {
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
        />
      ))}
    </div>
  );
}

interface RankingFilterProps {
  disciplines: Discipline[];
  setSelectedDiscipline: Dispatch<SetStateAction<Discipline | undefined>>;
  setSelectedGender: Dispatch<SetStateAction<string>>;
  setSelectedAgeGroup: Dispatch<SetStateAction<string>>;
}

function RankingFilter({
  disciplines,
  setSelectedDiscipline,
  setSelectedGender,
  setSelectedAgeGroup
}: RankingFilterProps) {
  return (
    <div className={"p-4 flex flex-col gap-6"}>
      <h2 className="text-2xl font-semibold">Rangliste</h2>
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
              setSelectedDiscipline(disciplines.find((d) => d.id === parseInt(e.target.value)))
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
          <RankingFilter
            disciplines={disciplines}
            setSelectedDiscipline={setSelectedDiscipline}
            setSelectedGender={setSelectedGender}
            setSelectedAgeGroup={setSelectedAgeGroup}
          />
          <Ranking
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
