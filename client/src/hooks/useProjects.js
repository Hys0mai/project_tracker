import { useCallback, useEffect, useState } from "react";
import { getProjects } from "../api";

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await getProjects();
            setProjects(data);
        } catch {
            setError("Could not load projects. Is the API running?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { projects, setProjects, loading, error, reload: load };
}