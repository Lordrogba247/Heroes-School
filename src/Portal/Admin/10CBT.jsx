import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import "./10CBT.css";

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
    "JSS 1", "JSS 2", "JSS 3",
    "SS 1", "SS 2", "SS 3",
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
];

// Card colors alternate purple/red
const cardAccents = ["purple", "red"];

// Mock data — backend dev go replace with real API
const initialTests = [
    {
        id: 1,
        subject: "Basic Science",
        classLevel: "JSS 2",
        description: "First C.A Test",
        duration: "30mins",
        questions: 25,
        date: "July 12, 2026",
        accent: "purple",
    },
    {
        id: 2,
        subject: "Literature-in-English",
        classLevel: "SS 1",
        description: "Second C.A Test",
        duration: "30mins",
        questions: 25,
        date: "July 27, 2026",
        accent: "red",
    },
];

export default function AdminCBT() {
    const [tests, setTests] = useState(initialTests);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        duration: "", date: "", description: "", classLevel: "", subject: "",
    });
    const [file, setFile] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const fileInputRef = useRef(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);
            setQuestionCount(rows.length);
        };
        reader.readAsArrayBuffer(selected);
    };

    const handleSchedule = () => {
        if (!form.subject || !form.classLevel || !form.duration || !form.date || !file) {
            alert("Please fill all fields and upload a question file.");
            return;
        }
        const newTest = {
            id: Date.now(),
            subject: form.subject,
            classLevel: form.classLevel,
            description: form.description,
            duration: form.duration,
            questions: questionCount,
            date: form.date,
            accent: cardAccents[tests.length % 2],
        };
        setTests((prev) => [newTest, ...prev]);
        setForm({ duration: "", date: "", description: "", classLevel: "", subject: "" });
        setFile(null);
        setQuestionCount(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setShowModal(false);
    };

    const handleDelete = (id) => {
        // Backend dev go hit DELETE endpoint here
        setTests((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="acbt-page">
            <h1 className="acbt-title">CBT Tests/Exams</h1>
            <p className="acbt-sub">See below the available computer-based tests/exams at your school</p>

            {/* Schedule button */}
            <button className="acbt-schedule-btn" onClick={() => setShowModal(true)}>
                Schedule CBT Test/Exam
                <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                </svg>
            </button>

            {/* Tests list */}
            <div className="acbt-list">
                {tests.map((t) => (
                    <div className="acbt-card" key={t.id}>
                        <div className={`acbt-card-header acbt-card-header--${t.accent}`}>
                            <p className="acbt-card-subject">{t.subject}</p>
                            <p className="acbt-card-meta-top">{t.classLevel} &nbsp;·&nbsp; {t.description}</p>
                        </div>
                        <div className="acbt-card-body">
                            <div className="acbt-card-info">
                                <p className="acbt-card-detail">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                                    </svg>
                                    Duration: {t.duration}
                                </p>
                                <p className="acbt-card-detail">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                                    </svg>
                                    Questions: {t.questions}
                                </p>
                                <p className="acbt-card-detail">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" />
                                    </svg>
                                    Date of Test/Exam: {t.date}
                                </p>
                            </div>
                            <button className="acbt-delete-btn" onClick={() => handleDelete(t.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Schedule Modal */}
            {showModal && (
                <div className="acbt-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="acbt-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="acbt-modal-header">
                            <h2 className="acbt-modal-title">Schedule CBT Test/Exam</h2>
                            <button className="acbt-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className="acbt-modal-body">
                            <div className="acbt-modal-grid">
                                <div className="acbt-field">
                                    <label className="acbt-label">Duration</label>
                                    <input name="duration" className="acbt-input" placeholder="e.g 30mins" value={form.duration} onChange={handleChange} />
                                </div>
                                <div className="acbt-field">
                                    <label className="acbt-label">Date</label>
                                    <input name="date" type="date" className="acbt-input" value={form.date} onChange={handleChange} />
                                </div>
                                <div className="acbt-field">
                                    <label className="acbt-label">Description</label>
                                    <input name="description" className="acbt-input" placeholder="First Term CA Test" value={form.description} onChange={handleChange} />
                                </div>
                                <div className="acbt-field">
                                    <label className="acbt-label">Upload file</label>
                                    <div className="acbt-upload" onClick={() => fileInputRef.current.click()}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V6H9v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S6 2.79 6 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1z" />
                                        </svg>
                                        <span>{file ? file.name : "attach file here"}</span>
                                        {questionCount > 0 && <span className="acbt-q-count">{questionCount} questions</span>}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={handleFileChange} />
                                </div>
                                <div className="acbt-field">
                                    <select name="classLevel" className="acbt-select" value={form.classLevel} onChange={handleChange}>
                                        <option value="">Select Class</option>
                                        {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="acbt-field">
                                    <select name="subject" className="acbt-select" value={form.subject} onChange={handleChange}>
                                        <option value="">Subject</option>
                                        {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button className="acbt-submit-btn" onClick={handleSchedule}>
                                Schedule CBT Test/Exam
                                <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}