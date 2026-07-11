import { useState, useRef, useEffect } from "react";
import "./5Assignment.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

// Standard Nigerian school subjects across Primary, JSS, and SSS levels
const subjectOptions = [
    // Core / common across levels
    "Mathematics",
    "English Language",
    "Basic Science",
    "Basic Technology",
    "Civic Education",
    "Social Studies",
    "Computer Studies/ICT",
    "Agricultural Science",
    "Christian Religious Studies",
    "Islamic Religious Studies",
    "Yoruba",
    "Hausa",
    "Igbo",
    "French",
    "Home Economics",
    "Physical and Health Education",
    "Creative and Cultural Arts",
    "Verbal Reasoning",
    "Quantitative Reasoning",
    // JSS / SSS
    "Business Studies",
    "Physics",
    "Chemistry",
    "Biology",
    "Further Mathematics",
    "Geography",
    "Government",
    "Economics",
    "Literature-in-English",
    "History",
    "Financial Account",
    "Commerce",
    "Marketing",
    "Technical Drawing",
    "Food and Nutrition",
];

const classOptions = [
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5",
    "JSS 1", "JSS 2", "JSS 3",
    "SSS 1", "SSS 2", "SSS 3",
];

export default function StaffAssignment() {
    const [subject, setSubject] = useState("");
    const [classLabel, setClassLabel] = useState("");
    const [instructions, setInstructions] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const fileInputRef = useRef(null);

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const token = localStorage.getItem("token");

    const loadAssignments = () => {
        setLoading(true);
        setError("");
        fetch(`${BASE_URL}/api/staff/assignments`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load assignments.");
                return res.json();
            })
            .then((data) => setAssignments(data.assignments || data || []))
            .catch(() => setError("Failed to load assignments."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    const resetForm = () => {
        setSubject("");
        setClassLabel("");
        setInstructions("");
        setAttachment(null);
        setDueDate("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0] || null);
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        if (!subject || !classLabel || !instructions.trim() || !dueDate.trim()) {
            return;
        }

        setSubmitting(true);
        setFormError("");
        try {
            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("classLabel", classLabel);
            formData.append("instructions", instructions);
            formData.append("dueDate", dueDate);
            if (attachment) formData.append("attachment", attachment);

            const res = await fetch(`${BASE_URL}/api/staff/assignments`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create assignment.");

            resetForm();
            loadAssignments(); // refresh from server so we get the real ID
        } catch (err) {
            setFormError(err.message || "Failed to create assignment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/staff/assignments/${deleteTarget._id || deleteTarget.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete assignment.");
            }
            setAssignments((prev) => prev.filter((a) => (a._id || a.id) !== (deleteTarget._id || deleteTarget.id)));
        } catch (err) {
            setError(err.message || "Failed to delete assignment.");
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="sga-page">
            <h1 className="sga-title">Assignment</h1>
            <p className="sga-sub">Manage assignment for your Students</p>

            {/* Create assignment form */}
            <form className="sga-form" onSubmit={handleAddAssignment}>
                <div className="sga-form-row">
                    <select
                        className="sga-select"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    >
                        <option value="" disabled>Subject</option>
                        {subjectOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        className="sga-select"
                        value={classLabel}
                        onChange={(e) => setClassLabel(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Class</option>
                        {classOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="sga-form-row">
                    <div className="sga-field">
                        <label className="sga-label" htmlFor="instructions">Instructions</label>
                        <textarea
                            id="instructions"
                            className="sga-textarea"
                            placeholder="Type here..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            required
                        />
                    </div>

                    <div className="sga-field">
                        <label className="sga-label" htmlFor="attachment">Attachment</label>
                        <div
                            className="sga-attach-box"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {attachment ? attachment.name : "attach file here"}
                        </div>
                        <input
                            ref={fileInputRef}
                            id="attachment"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="sga-form-row sga-form-row--bottom">
                    <div className="sga-field">
                        <label className="sga-label" htmlFor="dueDate">Due Date</label>
                        <input
                            id="dueDate"
                            type="text"
                            className="sga-input"
                            placeholder="Type here..."
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="sga-add-btn" disabled={submitting}>
                        {submitting ? "Adding..." : "Add Assignment"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                            <path d="M0 0h20v20H0z" fill="none" />
                            <path fill="#ffffff" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                        </svg>
                    </button>
                </div>

                {formError && <p className="sga-error">{formError}</p>}
            </form>

            {/* Recent assignments */}
            <div className="sga-recent-card">
                <div className="sga-recent-header">
                    <div className="sga-recent-header-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                            <path d="M0 0h20v20H0z" fill="none" />
                            <path fill="#ffffff" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                        </svg>
                    </div>
                    <div>
                        <p className="sga-recent-title">Recent Assignments</p>
                        <p className="sga-recent-subtitle">Manage your assignments</p>
                    </div>
                </div>

                <div className="sga-recent-body">
                    {loading && <p className="sga-empty">Loading assignments...</p>}
                    {!loading && error && <p className="sga-error">{error}</p>}
                    {!loading && !error && assignments.length === 0 && (
                        <p className="sga-empty">No assignments posted yet.</p>
                    )}
                    {!loading && assignments.map((a) => (
                        <div className="sga-recent-item" key={a._id || a.id}>
                            <span className="sga-recent-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                    <path d="M0 0h20v20H0z" fill="none" />
                                    <path fill="#112662" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                                </svg>
                            </span>
                            <div className="sga-recent-text">
                                <p className="sga-recent-item-title">{a.subject}</p>
                                <p className="sga-recent-item-meta">
                                    {a.classLabel} . To be submitted {a.due || a.dueDate}
                                </p>
                            </div>
                            <button
                                className="sga-delete-btn"
                                onClick={() => setDeleteTarget(a)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="sga-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="sga-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="sga-confirm-title">Delete Assignment?</h3>
                        <p className="sga-confirm-text">
                            Are you sure you want to delete the <strong>{deleteTarget.subject}</strong> assignment for {deleteTarget.classLabel}? This cannot be undone.
                        </p>
                        <div className="sga-confirm-actions">
                            <button
                                className="sga-confirm-btn sga-confirm-btn--cancel"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="sga-confirm-btn sga-confirm-btn--delete"
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