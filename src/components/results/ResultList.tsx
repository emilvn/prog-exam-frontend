import { Discipline } from "../../types/disciplines.types.ts";
import { Result } from "../../types/results.types.ts";
import { ParticipantWithDisciplines } from "../../types/participants.types.ts";
import { formatResult, sortResultsBestToWorst } from "../../helpers/resultHelpers.ts";
import { formatDate } from "../../utils/dateUtils.ts";

interface DisciplineGroupProps {
  discipline: Discipline;
  results: Result[];
  participants: ParticipantWithDisciplines[];
  onResultSelect?: (result: Result) => void;
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
                    <tr
                      key={result.id}
                      onClick={() => onResultSelect && onResultSelect(result)}
                      className={`${onResultSelect ? "border-b cursor-pointer hover:bg-sky-200 font-semibold" : ""}`}
                      title={onResultSelect ? "Klik for at redigere resultat" : undefined}
                    >
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

interface ResultProps {
  results: Result[];
  participants: ParticipantWithDisciplines[];
  disciplines: Discipline[];
  onResultSelect?: (result: Result) => void;
}

function ResultList({ results, participants, disciplines, onResultSelect }: ResultProps) {
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
          onResultSelect={onResultSelect}
        />
      ))}
    </div>
  );
}

export default ResultList;
