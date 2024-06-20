import { useEffect, useState } from "react";
import type { Discipline } from "../types/disciplines.types.ts";
import DataService from "../utils/DataService.ts";
import toast from "react-hot-toast";

function useDisciplines() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataService = new DataService<Discipline>("/disciplines");

  const fetchDisciplines = () => {
    return dataService.getAll();
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDisciplines()
      .then((disciplines) => {
        setDisciplines(disciplines);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          toast.error("Failed to fetch disciplines: " + error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const create = async (discipline: Discipline) => {
    try {
      const createdDiscipline = await dataService.create(discipline);
      setDisciplines([...disciplines, createdDiscipline]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to create selectedDiscipline: " + error.message);
      }
    }
  };

  const update = async (discipline: Discipline) => {
    try {
      const updatedDiscipline = await dataService.update(discipline, discipline.id ?? -1);
      setDisciplines(
        disciplines.map((d) => (d.id === updatedDiscipline.id ? updatedDiscipline : d))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to update selectedDiscipline: " + error.message);
      }
    }
  };

  return { disciplines, isLoading, create, update };
}

export default useDisciplines;
