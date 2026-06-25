import { useState, useRef } from "react";
import "./5Assignment.css";

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

// Mock recent assignments — backend dev go replace with real API (assignments posted by this staff)
const initialAssignments = [
    {
        id: 1,
        subject: "Chemistry",
        classLabel: "SS1",
        due: "July 12, 2026",
    },
];

export default function StaffAssignment() {
    const [subject, setSubject] = useState("");
    const [classLabel, setClassLabel] = useState("");
    const [instructions, setInstructions] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [dueDate, setDueDate] = useState("");
    const fileInputRef = useRef(null);

    const [assignments, setAssignments] = useState(initialAssignments);
    const [deleteTarget, setDeleteTarget] = useState(null);

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

    const handleAddAssignment = (e) => {
        e.preventDefault();
        if (!subject || !classLabel || !instructions.trim() || !dueDate.trim()) {
            return;
        }

        // Backend dev go POST this (with file upload) to the API, scoped to `classLabel`
        const newAssignment = {
            id: Date.now(),
            subject,
            classLabel,
            due: dueDate,
            instructions,
            attachmentName: attachment?.name || null,
        };

        setAssignments((prev) => [newAssignment, ...prev]);
        resetForm();
    };

    const confirmDelete = () => {
        // Backend dev go DELETE request here
        setAssignments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setDeleteTarget(null);
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

                    <button type="submit" className="sga-add-btn">
                        Add Assignment
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                            <path d="M0 0h20v20H0z" fill="none" />
                            <path fill="#ffffff" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                        </svg>
                    </button>
                </div>
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
                    {assignments.length === 0 && (
                        <p className="sga-empty">No assignments posted yet.</p>
                    )}
                    {assignments.map((a) => (
                        <div className="sga-recent-item" key={a.id}>
                            <span className="sga-recent-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                    <path d="M0 0h20v20H0z" fill="none" />
                                    <path fill="#112662" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                                </svg>
                            </span>
                            <div className="sga-recent-text">
                                <p className="sga-recent-item-title">{a.subject}</p>
                                <p className="sga-recent-item-meta">
                                    {a.classLabel} . To be submitted {a.due}
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