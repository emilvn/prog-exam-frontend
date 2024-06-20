import PageLayout from "../components/PageLayout.tsx";
import useParticipants from "../hooks/useParticipants.ts";
import useResults from "../hooks/useResults.ts";
import useDisciplines from "../hooks/useDisciplines.ts";

function Home() {
    const { participants, isLoading: pLoading } = useParticipants();
    const { results, isLoading: rLoading } = useResults();
    const { disciplines, isLoading: dLoading } = useDisciplines();

    return (
        <PageLayout>
            <h1>Home</h1>
            <p>Welcome to the Home page!</p>
            <h2>Participants</h2>
            {!pLoading &&
                participants.map((participant) => (
                    <div key={participant.id}>
                        <h3>{participant.name}</h3>
                    </div>
                ))}

            <h2>Results</h2>
            {!rLoading &&
                results.map((result) => (
                    <div key={result.id}>
                        <h3>{result.result}</h3>
                    </div>
                ))}

            <h2>Disciplines</h2>
            {!dLoading &&
                disciplines.map((discipline) => (
                    <div key={discipline.id}>
                        <h3>{discipline.name}</h3>
                    </div>
                ))}
        </PageLayout>
    );
}

export default Home;
