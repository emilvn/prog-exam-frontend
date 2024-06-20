interface QueryParam {
    key: string;
    value: string | number;
}

class DataService<DTO> {
    protected readonly endpoint = import.meta.env.VITE_API_URL;
    protected readonly uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    public async getAll(queryParams?: QueryParam[]): Promise<DTO[]> {
        const response = await fetch(
            this.endpoint + this.uri + this.createQueryParamString(queryParams)
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    public async get(id: number): Promise<DTO> {
        const response = await fetch(this.endpoint + this.uri + `/${id}`);
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
        return await response.json();
    }

    public async create(entity: Partial<DTO>): Promise<DTO> {
        const response = await fetch(this.endpoint + this.uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entity)
        });
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
        return await response.json();
    }

    public async update(entity: DTO, id: number): Promise<DTO> {
        const response = await fetch(this.endpoint + this.uri + `/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entity)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    public async patch(entity: Partial<DTO>, id: number): Promise<DTO> {
        const response = await fetch(this.endpoint + this.uri + `/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entity)
        });
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status} , ${await response.text()}`
            );
        }
        return await response.json();
    }

    public async delete(id: number): Promise<void> {
        const response = await fetch(this.endpoint + this.uri + `/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}, ${await response.text()}`
            );
        }
    }

    protected createQueryParamString(
        queryParams: QueryParam[] | undefined
    ): string {
        if (queryParams) {
            return queryParams.reduce((acc, param) => {
                return acc + `&${param.key}=${param.value}`;
            }, "?");
        }
        return "";
    }
}

export default DataService;
