import useDisciplines from "../hooks/useDisciplines.ts";
import { LoadingSpinner } from "../components/loading.tsx";

function Disciplines() {
    const { disciplines, isLoading, create, update, remove } = useDisciplines();
    return (
        <div>
            <h1>Disciplines</h1>
            <p>Here you can find all the disciplines</p>
            {isLoading && <LoadingSpinner />}
            {!isLoading &&
                disciplines.map((discipline) => (
                    <div key={discipline.id}>
                        <h2>{discipline.name}</h2>
                        <p>{discipline.resultType}</p>
                    </div>
                ))}
        </div>
    );
}

export default Disciplines;
