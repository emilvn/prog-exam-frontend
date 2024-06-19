import PageLayout from "../components/PageLayout.tsx";
import useExamples from "../hooks/useExamples.ts";

function Home() {
    const { examples } = useExamples();

    return (
        <PageLayout>
            <h1>Home</h1>
            <p>Welcome to the Home page!</p>
            {examples.length > 0 &&
                examples.map((example) => (
                    <p key={example.id}>{example.name}</p>
                ))}
        </PageLayout>
    );
}

export default Home;
