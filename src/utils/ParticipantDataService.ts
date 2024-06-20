import DataService from "./DataService.ts";
import { ParticipantDTO } from "../types/participants.types.ts";
import { Discipline } from "../types/disciplines.types.ts";

class ParticipantDataService extends DataService<ParticipantDTO> {
    constructor() {
        super("/participants");
    }

    public async getDisciplines(id: number): Promise<Discipline[]> {
        const response = await fetch(
            this.endpoint + this.uri + `/${id}/disciplines`
        );
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
        return await response.json();
    }

    public async addDiscipline(
        id: number,
        disciplineId: number
    ): Promise<Discipline[]> {
        const response = await fetch(
            this.endpoint + this.uri + `/${id}/disciplines`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: disciplineId })
            }
        );
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
        return await response.json();
    }

    public async removeDiscipline(
        id: number,
        disciplineId: number
    ): Promise<Discipline[]> {
        const response = await fetch(
            this.endpoint + this.uri + `/${id}/disciplines/${disciplineId}`,
            {
                method: "DELETE"
            }
        );
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
        return await response.json();
    }
}

export default ParticipantDataService;
