import DataService from "./DataService.ts";
import { ResultDTO } from "../types/results.types.ts";

class ResultDataService extends DataService<ResultDTO> {
    constructor() {
        super("/results");
    }

    public async getResultsByParticipantId(id: number): Promise<ResultDTO[]> {
        const response = await fetch(
            this.endpoint + this.uri + `/participant/${id}`
        );
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
        return await response.json();
    }

    public async getResultsByDisciplineId(id: number): Promise<ResultDTO[]> {
        const response = await fetch(
            this.endpoint + this.uri + `/discipline/${id}`
        );
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
        return await response.json();
    }
}

export default ResultDataService;
