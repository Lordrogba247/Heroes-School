import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./9Result.css";

const sessions = ["2024/2025", "2025/2026"];
const terms = ["First Term", "Second Term", "Third Term"];
const classOptions = [
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5",
    "JSS 1", "JSS 2", "JSS 3",
    "SSS 1", "SSS 2", "SSS 3",
];

// Mock students data — backend dev go replace with real API (students in selected class)
const studentsData = [
    { id: 1, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01324", sex: "M" },
    { id: 2, name: "Adekoya Bimbo Mosunmola", studentId: "HC/2025/01325", sex: "F" },
    { id: 3, name: "Temidire Audu Ali", studentId: "HC/2025/01326", sex: "M" },
    { id: 4, name: "Richard Judith emenembo", studentId: "HC/2025/01314", sex: "F" },
    { id: 5, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01354", sex: "M" },
    { id: 6, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01327", sex: "M" },
    { id: 7, name: "Abdulafeez Simbiat Rukayat", studentId: "HC/2025/01424", sex: "F" },
    { id: 8, name: "Luke Demilade Mary", studentId: "HC/2025/01320", sex: "F" },
    { id: 9, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01328", sex: "M" },
    { id: 10, name: "Tijesunimi Irede Dorcas", studentId: "HC/2025/01340", sex: "F" },
];

export default function AdminResultsList() {
    const navigate = useNavigate();

    const [session, setSession] = useState(sessions[1]);
    const [term, setTerm] = useState(terms[2]);
    const [classLabel, setClassLabel] = useState(classOptions[6]); // JSS 2

    const [students, setStudents] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleGetClassResults = () => {
        // Backend dev go fetch students + their results for session/term/classLabel here.
        // Using the same mock list regardless of selection for now.
        setStudents(studentsData);
        setUploadStatus(null);
    };

    const handleUploadResults = () => {
        if (students.length === 0) return;
        // Backend dev go finalize/publish all results for this class+session+term here
        setUploadStatus({
            type: "success",
            message: `All results for ${classLabel} (${session}, ${term}) have been uploaded.`,
        });
    };

    const handleViewResult = (student) => {
        navigate(`/portal/admin/results/${student.id}`, {
            state: { session, term, classLabel },
        });
    };

    const confirmDelete = () => {
        // Backend dev go DELETE this student's result here
        setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
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
                <button className="adr-get-btn" onClick={handleGetClassResults}>
                    Get Class Results
                </button>
                <button
                    className="adr-upload-btn"
                    onClick={handleUploadResults}
                    disabled={students.length === 0}
                >
                    Upload Results
                </button>
            </div>

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
                                    <tr key={s.id}>
                                        <td className="adr-name">{s.name}</td>
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
                            Are you sure you want to delete the result for <strong>{deleteTarget.name}</strong>? This cannot be undone.
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