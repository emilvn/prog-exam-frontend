import {
  newParticipant,
  Participant,
  ParticipantDTO,
  ParticipantWithDisciplines
} from "../../../types/participants.types.ts";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import useDisciplines from "../../../hooks/useDisciplines.ts";
import Modal from "../../generic/wrappers/Modal.tsx";
import FormInput from "../../generic/inputs/FormInput.tsx";
import Button from "../../generic/Button.tsx";
import ShowIf from "../../generic/wrappers/ShowIf.tsx";
import DeleteConfirmationModal from "../../generic/modals/DeleteConfirmationModal.tsx";
import { Discipline } from "../../../types/disciplines.types.ts";
import { MdClose } from "react-icons/md";
import MultiSelect from "../../generic/MultiSelect.tsx";

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
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedDisciplineIds(participant.disciplines.map((d) => d.id ?? -1));
  }, [participant]);

  useEffect(() => {
    setDisciplineIdsToAdd(
      selectedDisciplineIds.filter((id) => !participant.disciplines.some((pd) => pd.id === id))
    );
    setDisciplineIdsToRemove(
      participant.disciplines
        .filter((d) => !selectedDisciplineIds.includes(d.id ?? -1))
        .map((d) => d.id ?? -1)
    );
  }, [selectedDisciplineIds]);

  return (
    <div className={"w-96"}>
      <h2 className={"text-xl font-semibold"}>Discipliner</h2>
      <div className={"flex gap-1 flex-wrap w-96 mb-1"}>
        {disciplines
          .filter((d) => selectedDisciplineIds.includes(d.id ?? -1))
          .map((discipline) => (
            <div
              key={discipline.id}
              className={
                "border rounded-lg bg-sky-500 text-white text-xs p-1 font-semibold hover:bg-sky-300 cursor-pointer"
              }
              onClick={() => {
                setSelectedDisciplineIds((prev) => prev.filter((id) => id !== discipline.id));
              }}
            >
              <span>{discipline.name}</span>
              <MdClose className={"inline-block"} />
            </div>
          ))}
      </div>
      <MultiSelect
        options={disciplines.map((d) => ({ value: d.id ?? -1, label: d.name }))}
        selectedIds={selectedDisciplineIds}
        setSelectedIds={setSelectedDisciplineIds}
        placeholder={"Vælg Discipliner"}
      />
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
      if (
        !(
          participantToUpdate.name === selectedParticipant.name &&
          participantToUpdate.isMale === selectedParticipant.isMale &&
          participantToUpdate.birthDate.toISOString() ===
            selectedParticipant.birthDate.toISOString() &&
          participantToUpdate.club === selectedParticipant.club
        )
      ) {
        update(participantToUpdate);
      }
      if (disciplineIdsToAdd.length > 0) addDisciplines(disciplineIdsToAdd, selectedParticipant);
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
        <FormInput
          label={"Navn"}
          onChange={(event) => setName(event.target.value)}
          type={"text"}
          value={name}
        />
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
        <FormInput
          label={"Fødselsdag"}
          onChange={(event) => setBirthDate(event.target.value)}
          type={"date"}
          value={birthDate}
        />
        <FormInput
          label={"Klub"}
          onChange={(event) => setClub(event.target.value)}
          type={"text"}
          value={club}
        />
        {selectedParticipant && (
          <DisciplineEdit
            participant={selectedParticipant}
            disciplines={disciplines}
            setDisciplineIdsToAdd={setDisciplineIdsToAdd}
            setDisciplineIdsToRemove={setDisciplineIdsToRemove}
          />
        )}
        <div className={"flex justify-end items-center gap-2"}>
          <Button
            onClick={onClose}
            text={"Luk"}
            color={"gray"}
          />
          <ShowIf condition={!!selectedParticipant}>
            <Button
              onClick={() => setShowDeleteConfirmation(true)}
              text={"Slet"}
              color={"red"}
            />
          </ShowIf>
          <Button
            type={"submit"}
            color={"green"}
            text={"Gem"}
          />
        </div>
      </form>
      <ShowIf condition={showDeleteConfirmation}>
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmation(false)}
          onDelete={() => {
            if (selectedParticipant) remove(selectedParticipant);
            setShowDeleteConfirmation(false);
            onClose();
          }}
          title={`Er du sikker på at du vil slette ${selectedParticipant?.name}?`}
        />
      </ShowIf>
    </Modal>
  );
}

export default ParticipantModal;
