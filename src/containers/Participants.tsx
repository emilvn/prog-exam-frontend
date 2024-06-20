import useParticipants from "../hooks/useParticipants.ts";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import type {
    Participant,
    ParticipantDTO,
    ParticipantWithDisciplines
} from "../types/participants.types.ts";
import Modal from "../components/Modal.tsx";
import { newParticipant } from "../types/participants.types.ts";
import { sortParticipants } from "../helpers/participantHelpers.ts";
import { MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import useDisciplines from "../hooks/useDisciplines.ts";
import type { Discipline } from "../types/disciplines.types.ts";
import ShowIf from "../components/ShowIf.tsx";
import { LoadingSpinner } from "../components/loading.tsx";

interface DisciplineEditProps {
    participant: ParticipantWithDisciplines;
    disciplines: Discipline[];
    setDisciplineIdsToAdd: Dispatch<SetStateAction<number[]>>;
    setDisciplineIdsToRemove: Dispatch<SetStateAction<number[]>>;
}

function DisciplineEdit({
    participant,
    disciplines,
    setDisciplineIdsToAdd,
    setDisciplineIdsToRemove
}: DisciplineEditProps) {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [filteredDisciplines, setFilteredDisciplines] = useState<Discipline[]>(disciplines);
    const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>(
        participant.disciplines
    );

    useEffect(() => {
        setFilteredDisciplines(
            disciplines.filter((discipline) =>
                discipline.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, disciplines]);

    useEffect(() => {
        setDisciplineIdsToAdd(
            selectedDisciplines
                .filter((d) => !participant.disciplines.some((pd) => pd.id === d.id))
                .map((d) => d.id ?? -1)
        );
        setDisciplineIdsToRemove(
            participant.disciplines
                .filter((d) => !selectedDisciplines.some((sd) => sd.id === d.id))
                .map((d) => d.id ?? -1)
        );
    }, [selectedDisciplines]);

    return (
        <div className={"w-96"}>
            <h2 className={"text-xl font-semibold"}>Discipliner</h2>
            <div className={"flex gap-1 flex-wrap w-96 mb-1"}>
                {selectedDisciplines.map((discipline) => (
                    <div
                        key={discipline.id}
                        className={
                            "border rounded-lg bg-sky-500 text-white text-xs p-1 font-semibold hover:bg-sky-300 cursor-pointer"
                        }
                        onClick={() => {
                            setSelectedDisciplines((prev) =>
                                prev.filter((d) => d.id !== discipline.id)
                            );
                        }}
                    >
                        <span>{discipline.name}</span>
                        <MdClose className={"inline-block"} />
                    </div>
                ))}
            </div>
            <div className={"w-80 relative border rounded-lg py-2"}>
                <div className={"px-4 flex items-center justify-between"}>
                    <input
                        placeholder={"Vælg Discipliner"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={"focus:ring-transparent outline-none"}
                        onClick={() => setShowOptions(true)}
                    />
                    <div
                        className={"cursor-pointer h-6 w-6 flex justify-center items-center"}
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <MdKeyboardArrowDown />
                    </div>
                </div>
                {showOptions && (
                    <div
                        className={
                            "flex flex-col absolute bg-white border rounded-b z-50 w-full max-h-48 overflow-y-auto"
                        }
                    >
                        {filteredDisciplines.map((discipline) => {
                            const isDisciplineSelected = selectedDisciplines.some(
                                (selectedDiscipline) => selectedDiscipline.id === discipline.id
                            );
                            return (
                                <button
                                    key={discipline.id}
                                    className={
                                        "border-b px-4 py-2 hover:bg-sky-300 flex justify-between font-semibold" +
                                        (isDisciplineSelected ? " bg-sky-500 text-white" : "")
                                    }
                                    onClick={() => {
                                        if (isDisciplineSelected) {
                                            setSelectedDisciplines((prev) =>
                                                prev.filter((d) => d.id !== discipline.id)
                                            );
                                        } else {
                                            setSelectedDisciplines((prev) => [...prev, discipline]);
                                        }
                                    }}
                                    type={"button"}
                                >
                                    {discipline.name}
                                    {isDisciplineSelected && <MdClose className={"inline-block"} />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ParticipantModalProps {
    selectedParticipant: ParticipantWithDisciplines | null;
    create: (participant: ParticipantDTO) => void;
    update: (participant: Participant) => void;
    remove: (participant: Participant) => void;
    addDisciplines: (disciplineIds: number[], participant: Participant) => void;
    removeDisciplines: (disciplineIds: number[], participant: Participant) => void;
    onClose: () => void;
}

function ParticipantModal({
    selectedParticipant,
    create,
    update,
    remove,
    addDisciplines,
    removeDisciplines,
    onClose
}: ParticipantModalProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const [participantToCreate, setParticipantToCreate] = useState<ParticipantDTO>(newParticipant);
    const [participantToUpdate, setParticipantToUpdate] = useState<Participant | null>(
        selectedParticipant
    );
    const { disciplines } = useDisciplines();
    const [disciplineIdsToAdd, setDisciplineIdsToAdd] = useState<number[]>([]);
    const [disciplineIdsToRemove, setDisciplineIdsToRemove] = useState<number[]>([]);

    const [name, setName] = useState<string>(selectedParticipant?.name ?? "");
    const [isMale, setIsMale] = useState<boolean>(selectedParticipant?.isMale ?? true);
    const [birthDate, setBirthDate] = useState<string>(
        selectedParticipant?.birthDate.toISOString().split("T")[0] ?? ""
    );
    const [club, setClub] = useState<string>(selectedParticipant?.club ?? "");

    useEffect(() => {
        if (selectedParticipant) {
            setParticipantToUpdate({
                ...selectedParticipant,
                name,
                isMale,
                birthDate: new Date(birthDate),
                club
            });
        } else {
            setParticipantToCreate({
                name,
                isMale,
                birthDate,
                club
            });
        }
    }, [name, isMale, birthDate, club]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedParticipant && participantToUpdate) {
            update(participantToUpdate);
            if (disciplineIdsToAdd.length > 0)
                addDisciplines(disciplineIdsToAdd, selectedParticipant);
            if (disciplineIdsToRemove.length > 0)
                removeDisciplines(disciplineIdsToRemove, selectedParticipant);
        } else {
            create(participantToCreate);
        }

        onClose();
    };

    return (
        <Modal>
            <h1 className={"text-2xl font-semibold"}>
                {selectedParticipant ? "Redigér " + selectedParticipant.name : "Opret Deltager"}
            </h1>
            <form
                className={"flex flex-col gap-4"}
                onSubmit={onSubmit}
            >
                <label className={"flex flex-col"}>
                    Navn
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className={"border p-2 rounded"}
                    />
                </label>
                <label className={"flex flex-col"}>
                    Køn
                    <div className={"flex gap-2"}>
                        <input
                            type="radio"
                            checked={isMale}
                            onChange={() => setIsMale(true)}
                        />
                        Mand
                        <input
                            type="radio"
                            checked={!isMale}
                            onChange={() => setIsMale(false)}
                        />
                        Kvinde
                    </div>
                </label>
                <label className={"flex flex-col"}>
                    Fødselsdag
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(event) => setBirthDate(event.target.value)}
                        className={"border p-2 rounded"}
                    />
                </label>
                <label className={"flex flex-col"}>
                    Klub
                    <input
                        type="text"
                        value={club}
                        onChange={(event) => setClub(event.target.value)}
                        className={"border p-2 rounded"}
                    />
                </label>
                {selectedParticipant && (
                    <DisciplineEdit
                        participant={selectedParticipant}
                        disciplines={disciplines}
                        setDisciplineIdsToAdd={setDisciplineIdsToAdd}
                        setDisciplineIdsToRemove={setDisciplineIdsToRemove}
                    />
                )}
                <div className={"flex justify-end items-center gap-2"}>
                    <button
                        className={
                            "border rounded-lg bg-gray-500 hover:bg-gray-300 text-white px-4 py-2 font-semibold"
                        }
                        type="button"
                        onClick={onClose}
                    >
                        Luk
                    </button>
                    {selectedParticipant && (
                        <button
                            className={
                                "border rounded-lg bg-red-500 hover:bg-red-300 text-white px-4 py-2 font-semibold"
                            }
                            type="button"
                            onClick={() => setShowDeleteConfirmation(true)}
                        >
                            Slet
                        </button>
                    )}
                    <button
                        className={
                            "border rounded-lg bg-sky-500 hover:bg-sky-300 text-white px-4 py-2 font-semibold"
                        }
                        type="submit"
                    >
                        Gem
                    </button>
                </div>
            </form>
            {showDeleteConfirmation && (
                <Modal>
                    <h1 className={"text-2xl font-semibold"}>
                        Er du sikker på at du vil slette {selectedParticipant?.name}?
                    </h1>
                    <div className={"flex justify-end items-center gap-2"}>
                        <button
                            className={
                                "border rounded-lg bg-gray-500 hover:bg-gray-300 text-white px-4 py-2 font-semibold"
                            }
                            type="button"
                            onClick={() => setShowDeleteConfirmation(false)}
                        >
                            Nej
                        </button>
                        <button
                            className={
                                "border rounded-lg bg-red-500 hover:bg-red-300 text-white px-4 py-2 font-semibold"
                            }
                            type="button"
                            onClick={() => {
                                if (selectedParticipant) remove(selectedParticipant);
                                setShowDeleteConfirmation(false);
                                onClose();
                            }}
                        >
                            Ja
                        </button>
                    </div>
                </Modal>
            )}
        </Modal>
    );
}

interface ParticipantRowProps {
    participant: ParticipantWithDisciplines;
    onSelect: (participant: ParticipantWithDisciplines) => void;
}

function ParticipantRow({ participant, onSelect }: ParticipantRowProps) {
    return (
        <tr
            className="border-b cursor-pointer hover:bg-sky-200 font-semibold"
            onClick={() => onSelect(participant)}
            title={"Klik for at redigere"}
        >
            <td>{participant.name}</td>
            <td>{participant.isMale ? "M" : "K"}</td>
            <td>{participant.birthDate.getFullYear()}</td>
            <td>{participant.club}</td>
        </tr>
    );
}

interface ParticipantsProps {
    search?: string;
}

function Participants({ search }: ParticipantsProps) {
    const { participants, create, update, remove, addDisciplines, removeDisciplines, isLoading } =
        useParticipants();
    const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithDisciplines[]>(
        []
    );
    const [selectedParticipant, setSelectedParticipant] =
        useState<ParticipantWithDisciplines | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [sortColumn, setSortColumn] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        if (search && search !== "") {
            setFilteredParticipants(
                participants.filter((participant) =>
                    participant.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        } else {
            setFilteredParticipants(participants);
        }
    }, [search, participants]);

    useEffect(() => {
        setFilteredParticipants(sortParticipants(sortColumn, sortOrder, filteredParticipants));
    }, [sortColumn, sortOrder]);

    return (
        <div>
            <ShowIf condition={isLoading}>
                <div className={"flex justify-center items-center w-full h-96"}>
                    <LoadingSpinner />
                </div>
            </ShowIf>
            <ShowIf condition={!isLoading}>
                <div className={"p-4 flex items-center justify-between"}>
                    <div className={"flex items-end gap-2"}>
                        <h1 className={"text-2xl font-semibold"}>Deltagere</h1>
                        <span className={"text-gray-500"}>
                            Viser {filteredParticipants.length} / {participants.length} deltager(e)
                        </span>
                    </div>
                    <button
                        className={
                            "border rounded-lg bg-sky-500 hover:bg-sky-800 text-white px-4 py-2 font-semibold"
                        }
                        onClick={() => setShowModal(true)}
                        title={"Opret deltager"}
                    >
                        Opret deltager
                    </button>
                </div>
                <table className="w-full">
                    <thead className="bg-sky-300 text-white text-left">
                        <tr>
                            <th
                                className={"p-1 cursor-pointer select-none"}
                                onClick={() => {
                                    setSortColumn("name");
                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                }}
                            >
                                Navn
                                {sortColumn === "name" && sortOrder === "asc" && (
                                    <MdKeyboardArrowUp className={"inline-block"} />
                                )}
                                {sortColumn === "name" && sortOrder === "desc" && (
                                    <MdKeyboardArrowDown className={"inline-block"} />
                                )}
                            </th>
                            <th
                                className={"p-1 cursor-pointer select-none"}
                                onClick={() => {
                                    setSortColumn("isMale");
                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                }}
                            >
                                Køn
                                {sortColumn === "isMale" && sortOrder === "asc" && (
                                    <MdKeyboardArrowUp className={"inline-block"} />
                                )}
                                {sortColumn === "isMale" && sortOrder === "desc" && (
                                    <MdKeyboardArrowDown className={"inline-block"} />
                                )}
                            </th>
                            <th
                                className={"p-1 cursor-pointer select-none"}
                                onClick={() => {
                                    setSortColumn("birthDate");
                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                }}
                            >
                                Født
                                {sortColumn === "birthDate" && sortOrder === "asc" && (
                                    <MdKeyboardArrowUp className={"inline-block"} />
                                )}
                                {sortColumn === "birthDate" && sortOrder === "desc" && (
                                    <MdKeyboardArrowDown className={"inline-block"} />
                                )}
                            </th>
                            <th
                                className={"p-1 cursor-pointer select-none"}
                                onClick={() => {
                                    setSortColumn("club");
                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                }}
                            >
                                Klub
                                {sortColumn === "club" && sortOrder === "asc" && (
                                    <MdKeyboardArrowUp className={"inline-block"} />
                                )}
                                {sortColumn === "club" && sortOrder === "desc" && (
                                    <MdKeyboardArrowDown className={"inline-block"} />
                                )}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredParticipants.map((participant) => (
                            <ParticipantRow
                                key={participant.id}
                                participant={participant}
                                onSelect={(participant) => {
                                    setSelectedParticipant(participant);
                                    setShowModal(true);
                                }}
                            />
                        ))}
                    </tbody>
                </table>
                {showModal && (
                    <ParticipantModal
                        selectedParticipant={selectedParticipant}
                        create={create}
                        update={update}
                        remove={remove}
                        addDisciplines={addDisciplines}
                        removeDisciplines={removeDisciplines}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedParticipant(null);
                        }}
                    />
                )}
            </ShowIf>
        </div>
    );
}

export default Participants;
