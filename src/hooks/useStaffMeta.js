import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

// Module-level cache — same pattern as useMeta, separate cache since this hits a different endpoint
let staffMetaCache = null;

export function useStaffMeta() {
    const [meta, setMeta] = useState(staffMetaCache);
    const [loading, setLoading] = useState(!staffMetaCache);
    const [error, setError] = useState("");

    const fetchMeta = useCallback(async (force = false) => {
        if (staffMetaCache && !force) {
            setMeta(staffMetaCache);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/staff/meta`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load meta data.");
            const json = await res.json();
            staffMetaCache = json.data;
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

    // Given a class name (e.g. "Primary 1"), return its level (e.g. "primary")
    const getLevelForClass = useCallback(
        (className) => {
            const classes = meta?.classes || [];
            return classes.find((c) => c.name === className)?.level || null;
        },
        [meta]
    );

    // Given a class name, return the subjects available at that class's level
    const getSubjectsForClass = useCallback(
        (className) => {
            const level = getLevelForClass(className);
            return level ? (meta?.subjectsByLevel?.[level] || []) : [];
        },
        [meta, getLevelForClass]
    );

    return {
        subjects: meta?.subjects || [],
        subjectsByLevel: meta?.subjectsByLevel || {},
        classes: meta?.classes || [],
        sessions: meta?.sessions || [],
        terms: meta?.terms || [],
        loading,
        error,
        getLevelForClass,
        getSubjectsForClass,
        refetch: () => fetchMeta(true),
    };
}