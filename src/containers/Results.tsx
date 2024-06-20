import useResults from "../hooks/useResults.ts";
import { LoadingSpinner } from "../components/loading.tsx";
import useParticipants from "../hooks/useParticipants.ts";
import useDisciplines from "../hooks/useDisciplines.ts";

function Results() {
    const { results, isLoading, create, update, remove } = useResults();
    const { participants } = useParticipants();
    const { disciplines } = useDisciplines();
    return (
        <div>
            <h1>Results</h1>
            <p>Here you can find all the results</p>
            {isLoading && <LoadingSpinner />}
            {!isLoading &&
                results.map((result) => (
                    <div key={result.id}>
                        <h2>{result.result}</h2>
                        <p>{result.resultType}</p>
                        <p>
                            {
                                participants.find(
                                    (p) => p.id === result.participantId
                                )?.name
                            }
                        </p>
                        <p>
                            {
                                disciplines.find(
                                    (d) => d.id === result.disciplineId
                                )?.name
                            }
                        </p>
                    </div>
                ))}
        </div>
    );
}

export default Results;
