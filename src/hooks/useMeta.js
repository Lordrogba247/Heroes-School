import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

// Module-level cache so every component sharing this hook reuses one fetch
// per page-load instead of hitting /api/admin/meta again on every mount.
let metaCache = null;

export function useMeta() {
    const [meta, setMeta] = useState(metaCache);
    const [loading, setLoading] = useState(!metaCache);
    const [error, setError] = useState("");

    const fetchMeta = useCallback(async (force = false) => {
        if (metaCache && !force) {
            setMeta(metaCache);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/admin/meta`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load meta data.");
            const json = await res.json();
            metaCache = json.data;
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
        // sessions come back as objects: { name, startYear, endYear, isCurrent }
        sessions: meta?.sessions || [],
        terms: meta?.terms || [],
        roles: meta?.roles || [],
        loading,
        error,
        refetch: () => fetchMeta(true),
    };
}