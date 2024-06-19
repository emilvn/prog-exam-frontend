import { useEffect, useState } from "react";
import DataService from "../utils/DataService.ts";

interface Example {
    id?: number;
    name: string;
}

function useExamples() {
    const [examples, setExamples] = useState<Example[]>([]);
    const dataService = new DataService<Example>("/examples");

    const fetchExamples = async () => {
        return dataService.getAll();
    };

    useEffect(() => {
        // Fetch examples from the API
        fetchExamples().then((data) => setExamples(data));
    }, []);

    return { examples };
}

export default useExamples;
