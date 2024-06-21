import { Discipline } from "../types/disciplines.types.ts";
import { Dispatch, SetStateAction } from "react";

interface ResultFilterProps {
  disciplines: Discipline[];
  setSelectedDiscipline: Dispatch<SetStateAction<Discipline | undefined>>;
  setSelectedGender: Dispatch<SetStateAction<string>>;
  setSelectedAgeGroup: Dispatch<SetStateAction<string>>;
}

function ResultFilter({
  disciplines,
  setSelectedDiscipline,
  setSelectedGender,
  setSelectedAgeGroup
}: ResultFilterProps) {
  return (
    <div className="flex gap-8 items-center">
      <label className="flex flex-col w-56">
        <span>Vælg Aldersgruppe</span>
        <select
          onChange={(e) => setSelectedAgeGroup(e.target.value)}
          className="border p-2 rounded"
        >
          <option value={""}>Alle aldersgrupper</option>
          <option value={"Børn"}>Børn</option>
          <option value={"Unge"}>Unge</option>
          <option value={"Junior"}>Junior</option>
          <option value={"Voksne"}>Voksne</option>
          <option value={"Senior"}>Senior</option>
        </select>
      </label>
      <label className="flex flex-col w-56">
        Vælg disciplin
        <select
          onChange={(e) =>
            setSelectedDiscipline(disciplines.find((d) => d.id === parseInt(e.target.value)))
          }
          className="border p-2 rounded"
        >
          <option value={0}>Alle discipliner</option>
          {disciplines.map((discipline) => (
            <option
              key={discipline.id}
              value={discipline.id}
            >
              {discipline.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col w-56">
        Vælg køn
        <select
          onChange={(e) => setSelectedGender(e.target.value)}
          className="border p-2 rounded"
        >
          <option value={""}>Begge køn</option>
          <option value={"M"}>Mænd</option>
          <option value={"F"}>Kvinder</option>
        </select>
      </label>
    </div>
  );
}

export { ResultFilter };
