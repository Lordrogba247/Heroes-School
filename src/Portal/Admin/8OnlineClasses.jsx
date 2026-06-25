import { useState } from "react";
import "./8OnlineClasses.css";

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

// Mock scheduled sessions — backend dev go replace with real API (all sessions, all classes)
const initialSessions = [
    { id: 1, subject: "Mathematics", classLabel: "JSS 2", date: "July 12, 2026", time: "02:00pm", link: "" },
    { id: 2, subject: "Civic Education", classLabel: "JSS 2", date: "July 10, 2026", time: "10:00am", link: "" },
];

const emptyForm = { date: "", time: "", classLabel: "", subject: "", meetingLink: "" };

export default function AdminOnlineClass() {
    const [sessions, setSessions] = useState(initialSessions);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const openModal = () => {
        setForm(emptyForm);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(emptyForm);
    };

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        if (!form.date.trim() || !form.time.trim() || !form.classLabel || !form.subject || !form.meetingLink.trim()) {
            return;
        }

        // Backend dev go POST this to the API, scoped to `form.classLabel`.
        // This should push the session to that class's students and reflect on
        // the dashboard of the staff in charge of that class.
        const newSession = {
            id: Date.now(),
            subject: form.subject,
            classLabel: form.classLabel,
            date: form.date,
            time: form.time,
            link: form.meetingLink,
        };

        setSessions((prev) => [newSession, ...prev]);
        closeModal();
    };

    const handleStartSession = (session) => {
        if (session.link) {
            window.open(session.link, "_blank", "noopener,noreferrer");
        } else {
            alert("No meeting link has been set for this session yet.");
        }
    };

    const confirmDelete = () => {
        // Backend dev go DELETE request here
        setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="aoc-page">
            <h1 className="aoc-title">Online Classes</h1>
            <p className="aoc-sub">See below the available online classes</p>

            <button className="aoc-schedule-btn" onClick={openModal}>
                Schedule Session
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
            </button>

            <div className="aoc-list">
                {sessions.map((s, index) => {
                    const isNavy = index % 2 === 0;
                    return (
                        <div className="aoc-card" key={s.id}>
                            <div className={`aoc-card-header ${isNavy ? "aoc-card-header--navy" : "aoc-card-header--red"}`}>
                                <p className="aoc-card-subject">{s.subject}</p>
                                <div className="aoc-card-meta">
                                    <span className="aoc-meta-item">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                                        </svg>
                                        {s.date}
                                    </span>
                                    <span className="aoc-meta-item">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                        </svg>
                                        {s.classLabel}
                                    </span>
                                    <span className="aoc-meta-item">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                        </svg>
                                        {s.time}
                                    </span>
                                </div>
                            </div>

                            <div className="aoc-card-body">
                                <button
                                    className={`aoc-start-btn ${isNavy ? "aoc-start-btn--navy" : "aoc-start-btn--red"}`}
                                    onClick={() => handleStartSession(s)}
                                >
                                    Start Session Now
                                </button>
                                <button
                                    className="aoc-delete-btn"
                                    onClick={() => setDeleteTarget(s)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                {sessions.length === 0 && (
                    <p className="aoc-empty">No sessions scheduled yet.</p>
                )}
            </div>

            {/* Schedule Session modal */}
            {modalOpen && (
                <div className="aoc-modal-overlay" onClick={closeModal}>
                    <div className="aoc-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="aoc-modal-close" onClick={closeModal} aria-label="Close">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>

                        <h2 className="aoc-modal-title">Online Class</h2>
                        <p className="aoc-modal-sub">Schedule an online class session for your students</p>

                        <form onSubmit={handleSchedule}>
                            <div className="aoc-form-row">
                                <div className="aoc-field">
                                    <label className="aoc-label" htmlFor="date">Date</label>
                                    <input
                                        id="date"
                                        type="text"
                                        className="aoc-input"
                                        placeholder="Type here..."
                                        value={form.date}
                                        onChange={(e) => handleFormChange("date", e.target.value)}
                                    />
                                </div>

                                <div className="aoc-field">
                                    <label className="aoc-label" htmlFor="time">Time</label>
                                    <input
                                        id="time"
                                        type="text"
                                        className="aoc-input"
                                        placeholder="Type here..."
                                        value={form.time}
                                        onChange={(e) => handleFormChange("time", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="aoc-form-row">
                                <select
                                    className="aoc-select"
                                    value={form.classLabel}
                                    onChange={(e) => handleFormChange("classLabel", e.target.value)}
                                >
                                    <option value="" disabled>Select Class</option>
                                    {classOptions.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>

                                <select
                                    className="aoc-select"
                                    value={form.subject}
                                    onChange={(e) => handleFormChange("subject", e.target.value)}
                                >
                                    <option value="" disabled>Subject</option>
                                    {subjectOptions.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="aoc-field aoc-field--link">
                                <label className="aoc-label" htmlFor="meetingLink">Meeting Link</label>
                                <input
                                    id="meetingLink"
                                    type="url"
                                    className="aoc-input"
                                    placeholder="Paste meeting link here..."
                                    value={form.meetingLink}
                                    onChange={(e) => handleFormChange("meetingLink", e.target.value)}
                                />
                            </div>

                            <button type="submit" className="aoc-submit-btn">
                                Schedule Session
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="aoc-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="aoc-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="aoc-confirm-title">Delete Session?</h3>
                        <p className="aoc-confirm-text">
                            Are you sure you want to delete the <strong>{deleteTarget.subject}</strong> session for {deleteTarget.classLabel}? This cannot be undone.
                        </p>
                        <div className="aoc-confirm-actions">
                            <button
                                className="aoc-confirm-btn aoc-confirm-btn--cancel"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="aoc-confirm-btn aoc-confirm-btn--delete"
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