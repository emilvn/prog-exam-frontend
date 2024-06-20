import useDisciplines from "../hooks/useDisciplines.ts";
import { LoadingSpinner } from "../components/loading.tsx";
import { Discipline } from "../types/disciplines.types.ts";
import Modal from "../components/Modal.tsx";
import ShowIf from "../components/ShowIf.tsx";
import {
    formatResult,
    getBestResultByDisciplineAndGender,
    getResultTypeString
} from "../helpers/resultHelpers.ts";
import useParticipants from "../hooks/useParticipants.ts";
import useResults from "../hooks/useResults.ts";

interface DisciplineModalProps {
    discipline: Discipline;
    onClose: () => void;
}

function DisciplineModal({ discipline, onClose }: DisciplineModalProps) {
    return (
        <Modal>
            <h2>{discipline.name}</h2>
            <p>{discipline.resultType}</p>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
}

function Disciplines() {
    const { disciplines, isLoading, create, update } = useDisciplines();
    const { participants } = useParticipants();
    const { results } = useResults();

    return (
        <div>
            <ShowIf condition={isLoading}>
                <div className={"flex items-center justify-center absolute w-full h-full"}>
                    <LoadingSpinner />
                </div>
            </ShowIf>
            <ShowIf condition={!isLoading}>
                <h2 className={"text-2xl font-semibold p-2"}>Discipliner</h2>
                <table className={"w-full"}>
                    <thead className={"text-left"}>
                        <tr className={"border-b"}>
                            <th className={"p-1"}>Navn</th>
                            <th>Bedste Resultat Mænd</th>
                            <th>Bedste Resultat Kvinder</th>
                            <th>Resultattype</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disciplines.map((discipline) => (
                            <tr
                                key={discipline.id}
                                className={"text-xl border-b"}
                            >
                                <td className={"p-1"}>{discipline.name}</td>
                                <td>
                                    {formatResult(
                                        getBestResultByDisciplineAndGender(
                                            results,
                                            discipline,
                                            participants,
                                            true
                                        ).bestResult?.result ?? 0,
                                        discipline.resultType
                                    )}
                                </td>
                                <td>
                                    {formatResult(
                                        getBestResultByDisciplineAndGender(
                                            results,
                                            discipline,
                                            participants,
                                            false
                                        ).bestResult?.result ?? 0,
                                        discipline.resultType
                                    )}
                                </td>
                                <td>{getResultTypeString(discipline.resultType)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ShowIf>
        </div>
    );
}

export default Disciplines;
