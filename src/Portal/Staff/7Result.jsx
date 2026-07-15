import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMeta } from "../../hooks/useMeta";
import "./7Result.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

// Fallback only — used if the staff token can't access /api/admin/meta (likely admin-only).
// If useMeta succeeds, these are ignored and the live data from the DB is used instead.
const fallbackSessions = ["2024/2025", "2025/2026"];
const fallbackTerms = ["First Term", "Second Term", "Third Term"];

export default function StaffResultsList() {
    const navigate = useNavigate();
    const { sessions: metaSessions, terms: metaTerms, error: metaError } = useMeta();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [publishingId, setPublishingId] = useState(null);
    const [publishStatus, setPublishStatus] = useState(null);

    const [session, setSession] = useState("");
    const [term, setTerm] = useState("");

    const token = localStorage.getItem("token");

    // Prefer live meta data. If /api/admin/meta 403s or fails for this staff token,
    // metaSessions/metaTerms stay empty and we drop back to the hardcoded lists.
    const sessionOptions = metaSessions.length > 0 ? metaSessions.map((s) => s.name) : fallbackSessions;
    const termOptions = metaTerms.length > 0 ? metaTerms : fallbackTerms;

    useEffect(() => {
        if (sessionOptions.length > 0 && !session) {
            const current = metaSessions.find((s) => s.isCurrent);
            setSession(current ? current.name : sessionOptions[sessionOptions.length - 1]);
        }
        if (termOptions.length > 0 && !term) {
            setTerm(termOptions[termOptions.length - 1]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionOptions.length, termOptions.length]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/staff/results/students`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load students.");
                return res.json();
            })
            // NOTE: assuming this follows the same { success, data: [...] } convention
            // as the confirmed admin endpoints — flag to Victor if this comes back empty.
            .then((data) => setStudents(data.data || []))
            .catch(() => setError("Failed to load students."))
            .finally(() => setLoading(false));
    }, []);

    const handleUpload = (student) => {
        navigate(`/portal/staff/results/${student.studentId}`);
    };

    const handlePublishOne = async (student) => {
        setPublishingId(student.studentId);
        setPublishStatus(null);
        try {
            const res = await fetch(
                `${BASE_URL}/api/staff/results/${student.studentId}/publish`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ session, term }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to publish result.");

            setStudents((prev) =>
                prev.map((s) => (s.studentId === student.studentId ? { ...s, isFinal: true } : s))
            );
            setPublishStatus({ type: "success", message: data.message || "Result published." });
        } catch (err) {
            setPublishStatus({ type: "error", message: err.message || "Failed to publish result." });
        } finally {
            setPublishingId(null);
        }
    };

    if (loading) return <div className="srl-page"><p>Loading students...</p></div>;
    if (error) return <div className="srl-page"><p className="srl-error">{error}</p></div>;

    return (
        <div className="srl-page">
            <h1 className="srl-title">Results</h1>
            <p className="srl-sub">upload students results and comment on their performances</p>

            {metaError && (
                <p className="srl-status srl-status--error">
                    Couldn't load live sessions/terms — using default list. ({metaError})
                </p>
            )}

            <div className="srl-selectors">
                <select
                    className="srl-select"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                >
                    {sessionOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="srl-select"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                >
                    {termOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            {publishStatus && (
                <p className={`srl-status srl-status--${publishStatus.type}`}>
                    {publishStatus.message}
                </p>
            )}

            <div className="srl-table-card">
                <div className="srl-table-wrap">
                    <table className="srl-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Student ID</th>
                                <th>Sex</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.studentId}>
                                    <td className="srl-name">{s.name}</td>
                                    <td>{s.registrationId}</td>
                                    <td>{s.sex}</td>
                                    <td>
                                        <div className="srl-actions">
                                            <button
                                                className="srl-upload-btn"
                                                onClick={() => handleUpload(s)}
                                            >
                                                Upload Result
                                            </button>
                                            <button
                                                className="srl-publish-btn"
                                                onClick={() => handlePublishOne(s)}
                                                disabled={s.isFinal || publishingId === s.studentId}
                                            >
                                                {s.isFinal
                                                    ? "Published ✓"
                                                    : publishingId === s.studentId
                                                        ? "Publishing..."
                                                        : "Publish"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {students.length === 0 && (
                <p className="srl-empty">No students found in your class.</p>
            )}
        </div>
    );
}