// AdminResultsList (file 29)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./9Result.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

const sessions = ["2024/2025", "2025/2026"];
const terms = ["First Term", "Second Term", "Third Term"];
const classOptions = [
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5",
    "JSS 1", "JSS 2", "JSS 3",
    "SSS 1", "SSS 2", "SSS 3",
];

export default function AdminResultsList() {
    const navigate = useNavigate();

    const [session, setSession] = useState(sessions[1]);
    const [term, setTerm] = useState(terms[2]);
    const [classLabel, setClassLabel] = useState(classOptions[6]); // JSS 2

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [publishing, setPublishing] = useState(false);

    const token = localStorage.getItem("token");

    const handleGetClassResults = async () => {
        setLoading(true);
        setLoadError("");
        setUploadStatus(null);
        try {
            const params = new URLSearchParams({ session, term, class: classLabel });
            const res = await fetch(`${BASE_URL}/api/admin/results?${params}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load class results.");
            const data = await res.json();
            // Response shape is unconfirmed by the docs — assumes a `students` array
            // or plain array of { studentId (Mongo _id), name, studentId (human), sex }
            setStudents(data.students || data || []);
        } catch (err) {
            setLoadError(err.message || "Failed to load class results.");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadResults = async () => {
        if (students.length === 0) return;
        setPublishing(true);
        setUploadStatus(null);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/results/publish`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                // Docs example body only shows { session, term } — classLabel added since
                // this action is clearly scoped to the selected class. Confirm with backend.
                body: JSON.stringify({ session, term, classLabel }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to publish results.");

            setUploadStatus({
                type: "success",
                message: `All results for ${classLabel} (${session}, ${term}) have been uploaded.`,
            });
        } catch (err) {
            setUploadStatus({ type: "error", message: err.message || "Failed to publish results." });
        } finally {
            setPublishing(false);
        }
    };

    const handleViewResult = (student) => {
        navigate(`/portal/admin/results/${student._id || student.id}`, {
            state: { session, term, classLabel },
        });
    };

    const confirmDelete = async () => {
        try {
            const params = new URLSearchParams({ session, term });
            const res = await fetch(
                `${BASE_URL}/api/admin/results/${deleteTarget._id || deleteTarget.id}?${params}`,
                {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` },
                }
            );
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete result.");
            }
            setStudents((prev) => prev.filter((s) => (s._id || s.id) !== (deleteTarget._id || deleteTarget.id)));
        } catch (err) {
            setLoadError(err.message || "Failed to delete result.");
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="adr-page">
            <h1 className="adr-title">Results</h1>
            <p className="adr-sub">See below the available results by session, term and classes</p>

            <div className="adr-selectors">
                <select
                    className="adr-select"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                >
                    {sessions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="adr-select"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                >
                    {terms.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <select
                    className="adr-select"
                    value={classLabel}
                    onChange={(e) => setClassLabel(e.target.value)}
                >
                    {classOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="adr-action-row">
                <button className="adr-get-btn" onClick={handleGetClassResults} disabled={loading}>
                    {loading ? "Loading..." : "Get Class Results"}
                </button>
                <button
                    className="adr-upload-btn"
                    onClick={handleUploadResults}
                    disabled={students.length === 0 || publishing}
                >
                    {publishing ? "Uploading..." : "Upload Results"}
                </button>
            </div>

            {loadError && <p className="adr-status adr-status--error">{loadError}</p>}
            {uploadStatus && (
                <p className={`adr-status adr-status--${uploadStatus.type}`}>
                    {uploadStatus.message}
                </p>
            )}

            {students.length > 0 && (
                <div className="adr-table-card">
                    <div className="adr-table-wrap">
                        <table className="adr-table">
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
                                    <tr key={s._id || s.id}>
                                        <td className="adr-name">{s.name || `${s.surname} ${s.otherNames}`}</td>
                                        <td>{s.studentId}</td>
                                        <td>{s.sex}</td>
                                        <td>
                                            <div className="adr-actions">
                                                <button
                                                    className="adr-view-btn"
                                                    onClick={() => handleViewResult(s)}
                                                >
                                                    View Result
                                                </button>
                                                <button
                                                    className="adr-icon-btn adr-icon-btn--delete"
                                                    onClick={() => setDeleteTarget(s)}
                                                    aria-label="Delete result"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                                                        <path d="M0 0h24v24H0z" fill="none" />
                                                        <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="adr-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="adr-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="adr-confirm-title">Delete Result?</h3>
                        <p className="adr-confirm-text">
                            Are you sure you want to delete the result for <strong>{deleteTarget.name || `${deleteTarget.surname} ${deleteTarget.otherNames}`}</strong>? This cannot be undone.
                        </p>
                        <div className="adr-confirm-actions">
                            <button
                                className="adr-confirm-btn adr-confirm-btn--cancel"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="adr-confirm-btn adr-confirm-btn--delete"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}