import { useState, useRef } from "react";
import "./7Assignment.css";

// Same subject/class lists as Staff's Assignment page, for consistency
const subjectOptions = [
    "Mathematics", "English Language", "Basic Science", "Basic Technology",
    "Civic Education", "Social Studies", "Computer Studies/ICT", "Agricultural Science",
    "Christian Religious Studies", "Islamic Religious Studies", "Yoruba", "Hausa", "Igbo",
    "French", "Home Economics", "Physical and Health Education", "Creative and Cultural Arts",
    "Verbal Reasoning", "Quantitative Reasoning", "Business Studies", "Physics", "Chemistry",
    "Biology", "Further Mathematics", "Geography", "Government", "Economics",
    "Literature-in-English", "History", "Financial Account", "Commerce", "Marketing",
    "Technical Drawing", "Food and Nutrition",
];

const classOptions = [
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5",
    "JSS 1", "JSS 2", "JSS 3",
    "SSS 1", "SSS 2", "SSS 3",
];

// Mock assignments — backend dev go replace with real API (all assignments, all classes)
const initialAssignments = [
    { id: 1, subject: "Chemistry", classLabel: "SSS 1", due: "July 12, 2026" },
    { id: 2, subject: "Mathematics", classLabel: "Primary 1", due: "July 12, 2026" },
    { id: 3, subject: "Government", classLabel: "SSS 2", due: "July 12, 2026" },
    { id: 4, subject: "Basic Science", classLabel: "JSS 2", due: "July 12, 2026" },
    { id: 5, subject: "PHE", classLabel: "Primary 5", due: "July 12, 2026" },
    { id: 6, subject: "Literature-in-English", classLabel: "SS 3", due: "July 12, 2026" },
];

const emptyForm = { subject: "", classLabel: "", instructions: "", dueDate: "" };

export default function AdminAssignment() {
    const [assignments, setAssignments] = useState(initialAssignments);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const openAddModal = () => {
        setForm(emptyForm);
        setAttachment(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(emptyForm);
        setAttachment(null);
    };

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0] || null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.subject || !form.classLabel || !form.instructions.trim() || !form.dueDate.trim()) {
            return;
        }

        // Backend dev go POST this (with file upload) to the API, scoped to `form.classLabel`.
        // This should push the assignment to that class's students and show on the staff dashboard
        // for the teacher in charge of that class.
        const newAssignment = {
            id: Date.now(),
            subject: form.subject,
            classLabel: form.classLabel,
            due: form.dueDate,
            instructions: form.instructions,
            attachmentName: attachment?.name || null,
        };

        setAssignments((prev) => [newAssignment, ...prev]);
        closeModal();
    };

    const confirmDelete = () => {
        // Backend dev go DELETE request here
        setAssignments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="ada-page">
            <h1 className="ada-title">Assignments</h1>
            <p className="ada-sub">See below the available assignments</p>

            <button className="ada-add-btn" onClick={openAddModal}>
                Add Assignment
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20">
                    <path d="M0 0h20v20H0z" fill="none" />
                    <path fill="currentColor" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                </svg>
            </button>

            <div className="ada-list">
                {assignments.map((a) => (
                    <div className="ada-row" key={a.id}>
                        <span className="ada-row-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20">
                                <path d="M0 0h20v20H0z" fill="none" />
                                <path fill="currentColor" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                            </svg>
                        </span>
                        <div className="ada-row-text">
                            <p className="ada-row-title">{a.subject}</p>
                            <p className="ada-row-meta">
                                {a.classLabel} . To be submitted {a.due}
                            </p>
                        </div>
                        <button
                            className="ada-delete-btn"
                            onClick={() => setDeleteTarget(a)}
                        >
                            Delete
                        </button>
                    </div>
                ))}

                {assignments.length === 0 && (
                    <p className="ada-empty">No assignments posted yet.</p>
                )}
            </div>

            {/* Add Assignment modal */}
            {modalOpen && (
                <div className="ada-modal-overlay" onClick={closeModal}>
                    <div className="ada-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="ada-modal-close" onClick={closeModal} aria-label="Close">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>

                        <h2 className="ada-modal-title">Assignment</h2>
                        <p className="ada-modal-sub">Manage assignment for your Students</p>

                        <form onSubmit={handleSubmit}>
                            <div className="ada-form-row">
                                <select
                                    className="ada-select"
                                    value={form.subject}
                                    onChange={(e) => handleFormChange("subject", e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Subject</option>
                                    {subjectOptions.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>

                                <select
                                    className="ada-select"
                                    value={form.classLabel}
                                    onChange={(e) => handleFormChange("classLabel", e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Class</option>
                                    {classOptions.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="ada-form-row">
                                <div className="ada-field">
                                    <label className="ada-label" htmlFor="instructions">Instructions</label>
                                    <textarea
                                        id="instructions"
                                        className="ada-textarea"
                                        placeholder="Type here..."
                                        value={form.instructions}
                                        onChange={(e) => handleFormChange("instructions", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="ada-field">
                                    <label className="ada-label" htmlFor="attachment">Attachment</label>
                                    <div
                                        className="ada-attach-box"
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

                            <div className="ada-form-row ada-form-row--bottom">
                                <div className="ada-field">
                                    <label className="ada-label" htmlFor="dueDate">Due Date</label>
                                    <input
                                        id="dueDate"
                                        type="text"
                                        className="ada-input"
                                        placeholder="Type here..."
                                        value={form.dueDate}
                                        onChange={(e) => handleFormChange("dueDate", e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="ada-submit-btn">
                                    Add Assignment
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="ada-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="ada-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="ada-confirm-title">Delete Assignment?</h3>
                        <p className="ada-confirm-text">
                            Are you sure you want to delete the <strong>{deleteTarget.subject}</strong> assignment for {deleteTarget.classLabel}? This cannot be undone.
                        </p>
                        <div className="ada-confirm-actions">
                            <button
                                className="ada-confirm-btn ada-confirm-btn--cancel"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="ada-confirm-btn ada-confirm-btn--delete"
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