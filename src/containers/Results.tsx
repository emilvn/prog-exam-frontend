import useResults from "../hooks/useResults.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useDisciplines from "../hooks/useDisciplines.ts";
import type { Discipline } from "../types/disciplines.types.ts";
import { useEffect, useState } from "react";
import type { Result } from "../types/results.types.ts";
import type { ParticipantWithDisciplines } from "../types/participants.types.ts";
import { getAge } from "../utils/dateUtils.ts";
import ShowIf from "../components/generic/wrappers/ShowIf.tsx";
import { LoadingSpinner } from "../components/generic/loading.tsx";
import ResultFilter from "../components/results/ResultFilter.tsx";
import ResultList from "../components/results/ResultList.tsx";
import ResultModal from "../components/results/modals/ResultModal.tsx";

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
