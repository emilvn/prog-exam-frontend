import useParticipants from "../hooks/useParticipants.ts";
import { useEffect, useState } from "react";
import type { ParticipantWithDisciplines } from "../types/participants.types.ts";
import { getAgeGroup, sortParticipants } from "../helpers/participantHelpers.ts";
import { MdClose, MdEdit, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import useDisciplines from "../hooks/useDisciplines.ts";
import ShowIf from "../components/generic/wrappers/ShowIf.tsx";
import { LoadingSpinner } from "../components/generic/loading.tsx";
import { TbDeviceWatchStats2 } from "react-icons/tb";
import ParticipantModal from "../components/participants/modals/ParticipantModal.tsx";
import ParticipantResultModal from "../components/participants/modals/ParticipantResultModal.tsx";

interface ParticipantRowProps {
  participant: ParticipantWithDisciplines;
  onEditClick: (participant: ParticipantWithDisciplines) => void;
  onShowResultsClick: (participant: ParticipantWithDisciplines) => void;
}

function ParticipantRow({ participant, onEditClick, onShowResultsClick }: ParticipantRowProps) {
  return (
    <tr className="border-b font-semibold">
      <td>{participant.name}</td>
      <td>{participant.isMale ? "M" : "K"}</td>
      <td>{participant.birthDate.getFullYear()}</td>
      <td>{getAgeGroup(participant)}</td>
      <td>{participant.club}</td>
      <td>
        <button
          onClick={() => onShowResultsClick(participant)}
          title={"Klik for at se resultater"}
          className={"bg-green-200 hover:bg-green-300 p-2 w-8 rounded-xl"}
        >
          <TbDeviceWatchStats2 />
        </button>
        <button
          onClick={() => onEditClick(participant)}
          title={"Klik for at redigere"}
          className={"bg-yellow-200 hover:bg-yellow-300 p-2 w-8 rounded-xl"}
        >
          <MdEdit />
        </button>
      </td>
    </tr>
  );
}

interface ParticipantsProps {
  search?: string;
}

function Participants({ search }: ParticipantsProps) {
  const { participants, create, update, remove, addDisciplines, removeDisciplines, isLoading } =
    useParticipants();
  const { disciplines } = useDisciplines();
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithDisciplines[]>(
    []
  );
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantWithDisciplines | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<
    { label: string; value: string | number; type: string }[]
  >([]);
  const [filterOptions, setFilterOptions] = useState<
    { label: string; value: string | number; type: string }[]
  >([]);

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

  useEffect(() => {
    setFilterOptions([
      {
        label: "Børn",
        value: "Børn",
        type: "ageGroup"
      },
      {
        label: "Unge",
        value: "Unge",
        type: "ageGroup"
      },
      {
        label: "Junior",
        value: "Junior",
        type: "ageGroup"
      },
      {
        label: "Voksne",
        value: "Voksne",
        type: "ageGroup"
      },
      {
        label: "Senior",
        value: "Senior",
        type: "ageGroup"
      },
      {
        label: "Mænd",
        value: "Mænd",
        type: "gender"
      },
      {
        label: "Kvinder",
        value: "Kvinder",
        type: "gender"
      },
      ...disciplines.map((d) => ({ label: d.name, value: d.id ?? -1, type: "discipline" }))
    ]);
  }, [disciplines]);

  useEffect(() => {
    if (selectedFilterOptions.length > 0) {
      let fp = participants;
      selectedFilterOptions.forEach((option) => {
        fp = fp.filter((participant) => {
          if (option.value === "Mænd") {
            return participant.isMale;
          } else if (option.value === "Kvinder") {
            return !participant.isMale;
          } else if (typeof option.value === "number") {
            return participant.disciplines.some((d) => d.id === option.value);
          } else {
            return getAgeGroup(participant) === option.value;
          }
        });
      });
      setFilteredParticipants(fp);
    } else {
      setFilteredParticipants(participants);
    }
  }, [selectedFilterOptions]);

  return (
    <>
      <ShowIf condition={isLoading}>
        <div className={"flex justify-center items-center w-full h-96"}>
          <LoadingSpinner />
        </div>
      </ShowIf>
      <ShowIf condition={!isLoading}>
        <div className={"w-full"}>
          <div className={"p-4 flex items-center justify-between"}>
            <div className={"flex items-end gap-2"}>
              <h1 className={"text-2xl font-semibold"}>Deltagere</h1>
              <span className={"text-gray-500"}>
                Viser {filteredParticipants.length} / {participants.length} deltager(e)
              </span>
            </div>
            <button
              className={"bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"}
              onClick={() => setShowModal(true)}
              title={"Opret deltager"}
            >
              Opret deltager
            </button>
          </div>
          <div className={"w-96 flex items-end gap-2 py-2"}>
            <label className="flex flex-col ml-4">
              <span className={"italic text-sm"}>Filtrér</span>
              <select
                onChange={(e) => {
                  const option = filterOptions.find((option) => option.value == e.target.value);
                  if (!option) return;
                  setSelectedFilterOptions((prev) => {
                    if (prev.some((o) => o.type === option.type)) {
                      return [...prev.filter((o) => o.type !== option.type), option];
                    }
                    return [...prev, option];
                  });
                }}
                value={selectedFilterOptions[0]?.value ?? ""}
                className="border p-1 rounded"
              >
                <option value={""}>Alle</option>
                {filterOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div>
              {selectedFilterOptions.length > 0 && (
                <div className={"flex gap-2"}>
                  {selectedFilterOptions.map((option) => (
                    <div
                      key={option.value}
                      className={
                        "bg-sky-500 text-white p-1 rounded-lg cursor-pointer hover:bg-sky-300"
                      }
                    >
                      {option.label}
                      <MdClose
                        onClick={() => {
                          setSelectedFilterOptions((prev) =>
                            prev.filter((o) => o.value !== option.value)
                          );
                        }}
                        className={"inline-block"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                    setSortColumn("birthDate");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Aldersgruppe
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
                <th className={"p-1"}></th>
              </tr>
            </thead>

            <tbody>
              {filteredParticipants.map((participant) => (
                <ParticipantRow
                  key={participant.id}
                  participant={participant}
                  onEditClick={(participant) => {
                    setSelectedParticipant(participant);
                    setShowModal(true);
                  }}
                  onShowResultsClick={(participant) => {
                    setSelectedParticipant(participant);
                    setShowResultsModal(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
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
        {showResultsModal && selectedParticipant && (
          <ParticipantResultModal
            participant={selectedParticipant}
            onClose={() => {
              setShowResultsModal(false);
              setSelectedParticipant(null);
            }}
          />
        )}
      </ShowIf>
    </>
  );
}

export default Participants;
