import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

let studentMetaCache = null;

export function useStudentMeta() {
    const [meta, setMeta] = useState(studentMetaCache);
    const [loading, setLoading] = useState(!studentMetaCache);
    const [error, setError] = useState("");

    const fetchMeta = useCallback(async (force = false) => {
        if (studentMetaCache && !force) {
            setMeta(studentMetaCache);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/student/meta`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load meta data.");
            const json = await res.json();
            studentMetaCache = json.data;
            setMeta(json.data);
        } catch (err) {
            setError(err.message || "Failed to load meta data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMeta();
    }, [fetchMeta]);

    return {
        subjects: meta?.subjects || [],
        classes: meta?.classes || [],
        sessions: meta?.sessions || [],
        terms: meta?.terms || [],
        loading,
        error,
        refetch: () => fetchMeta(true),
    };
}