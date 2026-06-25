import { useState } from "react";
import "./6OnlineClass.css";

// Reuse the same subject/class lists from Assignment for consistency
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

// Mock scheduled sessions — backend dev go replace with real API (sessions created by this staff)
const initialSessions = [
    {
        id: 1,
        subject: "Physics",
        classLabel: "SSS 2",
        date: "July 12, 2026",
        time: "10:00am",
        link: "",
    },
];

export default function StaffOnlineClass() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [classLabel, setClassLabel] = useState("");
    const [subject, setSubject] = useState("");
    const [meetingLink, setMeetingLink] = useState("");

    const [sessions, setSessions] = useState(initialSessions);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const resetForm = () => {
        setDate("");
        setTime("");
        setClassLabel("");
        setSubject("");
        setMeetingLink("");
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        if (!date.trim() || !time.trim() || !classLabel || !subject || !meetingLink.trim()) {
            return;
        }

        // Backend dev go POST this to the API, scoped to `classLabel`
        const newSession = {
            id: Date.now(),
            subject,
            classLabel,
            date,
            time,
            link: meetingLink,
        };

        setSessions((prev) => [newSession, ...prev]);
        resetForm();
    };

    const handleStartSession = (session) => {
        if (session.link) {
            window.open(session.link, "_blank", "noopener,noreferrer");
        } else {
            // Backend dev go ensure every session has a real meeting link before this fires
            alert("No meeting link has been set for this session yet.");
        }
    };

    const confirmDelete = () => {
        // Backend dev go DELETE request here
        setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="soc-page">
            <h1 className="soc-title">Online Class</h1>
            <p className="soc-sub">Schedule, start online class session with your students</p>

            {/* Schedule form */}
            <form className="soc-form" onSubmit={handleSchedule}>
                <div className="soc-form-row">
                    <div className="soc-field">
                        <label className="soc-label" htmlFor="date">Date</label>
                        <input
                            id="date"
                            type="text"
                            className="soc-input"
                            placeholder="Type here..."
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="soc-field">
                        <label className="soc-label" htmlFor="time">Time</label>
                        <input
                            id="time"
                            type="text"
                            className="soc-input"
                            placeholder="Type here..."
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="soc-form-row">
                    <select
                        className="soc-select"
                        value={classLabel}
                        onChange={(e) => setClassLabel(e.target.value)}
                    >
                        <option value="" disabled>Select Class</option>
                        {classOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        className="soc-select"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    >
                        <option value="" disabled>Subject</option>
                        {subjectOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="soc-field soc-field--link">
                    <label className="soc-label" htmlFor="meetingLink">Meeting Link</label>
                    <input
                        id="meetingLink"
                        type="url"
                        className="soc-input"
                        placeholder="Paste meeting link here..."
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                    />
                </div>

                <button type="submit" className="soc-schedule-btn">
                    Schedule Session
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                </button>
            </form>

            {/* Scheduled sessions */}
            <div className="soc-list">
                {sessions.map((s) => (
                    <div className="soc-card" key={s.id}>
                        <div className="soc-card-header">
                            <p className="soc-card-subject">{s.subject}</p>
                            <div className="soc-card-meta">
                                <span className="soc-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                                    </svg>
                                    {s.date}
                                </span>
                                <span className="soc-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                    {s.classLabel}
                                </span>
                                <span className="soc-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                    {s.time}
                                </span>
                            </div>
                        </div>

                        <div className="soc-card-body">
                            <button
                                className="soc-start-btn"
                                onClick={() => handleStartSession(s)}
                            >
                                Start Session Now
                            </button>
                            <button
                                className="soc-delete-btn"
                                onClick={() => setDeleteTarget(s)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {sessions.length === 0 && (
                    <p className="soc-empty">No sessions scheduled yet.</p>
                )}
            </div>

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="soc-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="soc-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="soc-confirm-title">Delete Session?</h3>
                        <p className="soc-confirm-text">
                            Are you sure you want to delete the <strong>{deleteTarget.subject}</strong> session for {deleteTarget.classLabel}? This cannot be undone.
                        </p>
                        <div className="soc-confirm-actions">
                            <button
                                className="soc-confirm-btn soc-confirm-btn--cancel"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="soc-confirm-btn soc-confirm-btn--delete"
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