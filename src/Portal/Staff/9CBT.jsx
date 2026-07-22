import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import "./9CBT.css";
import { useStaffMeta } from "../../hooks/useStaffMeta";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

export default function StaffCBT() {
    const { subjects: subjectOptions, classes: classOptions, loading: metaLoading } = useStaffMeta();

    const [form, setForm] = useState({
        duration: "",
        date: "",
        description: "",
        classLevel: "",
        subject: "",
    });
    const [file, setFile] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [scheduling, setScheduling] = useState(false);
    const [formError, setFormError] = useState("");
    const fileInputRef = useRef(null);

    const token = localStorage.getItem("token");

    const loadTests = () => {
        setLoading(true);
        setError("");
        // Staff CRUD for CBT lives under /api/teacher/cbt, not /api/staff/cbt
        // (confirmed by Victor: GET/POST/DELETE /api/teacher/cbt, roleCheck('teacher','admin'))
        fetch(`${BASE_URL}/api/teacher/cbt`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load CBT tests.");
                return res.json();
            })
            .then((data) => setTests(data.data || []))
            .catch(() => setError("Failed to load CBT tests."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTests();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Parse Excel and count question rows (for display only — backend re-parses the file itself)
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);
            setQuestionCount(rows.length);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleSchedule = async () => {
        if (!form.subject || !form.classLevel || !form.duration || !form.date || !file) {
            alert("Please fill all fields and upload a question file.");
            return;
        }

        setScheduling(true);
        setFormError("");
        try {
            const formData = new FormData();
            formData.append("subject", form.subject);
            formData.append("classLevel", form.classLevel);
            formData.append("description", form.description);
            formData.append("duration", form.duration);
            formData.append("date", form.date);
            formData.append("excelFile", file);

            const res = await fetch(`${BASE_URL}/api/teacher/cbt`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to schedule test.");

            setForm({ duration: "", date: "", description: "", classLevel: "", subject: "" });
            setFile(null);
            setQuestionCount(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
            loadTests(); // refresh from server so we get the real ID and server-parsed question count
        } catch (err) {
            setFormError(err.message || "Failed to schedule test. Please try again.");
        } finally {
            setScheduling(false);
        }
    };

    const handleDelete = async (test) => {
        try {
            const res = await fetch(`${BASE_URL}/api/teacher/cbt/${test._id || test.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete test.");
            }
            setTests((prev) => prev.filter((t) => (t._id || t.id) !== (test._id || test.id)));
        } catch (err) {
            setError(err.message || "Failed to delete test.");
        }
    };

    return (
        <div className="sc-page">
            <h1 className="sc-title">CBT Tests/Exams</h1>
            <p className="sc-sub">Schedule, upload computer based tests for your students</p>

            {/* Form */}
            <div className="sc-form">
                <div className="sc-form-grid">
                    {/* Duration */}
                    <div className="sc-field">
                        <label className="sc-label">Duration</label>
                        <input
                            name="duration"
                            className="sc-input"
                            placeholder="Type here..."
                            value={form.duration}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Date */}
                    <div className="sc-field">
                        <label className="sc-label">Date</label>
                        <input
                            name="date"
                            type="date"
                            className="sc-input"
                            value={form.date}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Description */}
                    <div className="sc-field">
                        <label className="sc-label">Description</label>
                        <input
                            name="description"
                            className="sc-input"
                            placeholder="First Term CA Test"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Upload file */}
                    <div className="sc-field">
                        <label className="sc-label">upload file</label>
                        <div
                            className="sc-upload"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V6H9v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S6 2.79 6 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1z" />
                            </svg>
                            <span>{file ? file.name : "attach file here"}</span>
                            {questionCount > 0 && (
                                <span className="sc-q-count">{questionCount} questions</span>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Select Class */}
                    <div className="sc-field">
                        <select
                            name="classLevel"
                            className="sc-select"
                            value={form.classLevel}
                            onChange={handleChange}
                            disabled={metaLoading}
                        >
                            <option value="">Select Class</option>
                            {classOptions.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div className="sc-field">
                        <select
                            name="subject"
                            className="sc-select"
                            value={form.subject}
                            onChange={handleChange}
                            disabled={metaLoading}
                        >
                            <option value="">Subject</option>
                            {subjectOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Schedule button */}
                <button className="sc-schedule-btn" onClick={handleSchedule} disabled={scheduling}>
                    {scheduling ? "Scheduling..." : "Schedule CBT Test/Exam"}
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                    </svg>
                </button>

                {formError && <p className="sc-error">{formError}</p>}
            </div>

            {/* Scheduled tests list */}
            <div className="sc-list">
                {loading && <p className="sc-empty">Loading tests...</p>}
                {!loading && error && <p className="sc-error">{error}</p>}
                {!loading && tests.length === 0 && <p className="sc-empty">No tests scheduled yet.</p>}

                {!loading && tests.map((t) => (
                    <div className="sc-card" key={t._id || t.id}>
                        <div className="sc-card-header">
                            <div>
                                <p className="sc-card-subject">{t.subject}</p>
                                <p className="sc-card-meta-top">{t.classLevel} &nbsp;·&nbsp; {t.description}</p>
                            </div>
                        </div>
                        <div className="sc-card-body">
                            <div className="sc-card-info">
                                <p className="sc-card-detail">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                                    </svg>
                                    Duration: {t.duration}
                                </p>
                                <p className="sc-card-detail">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                                    </svg>
                                    Questions: {t.questions}
                                </p>
                                <p className="sc-card-detail">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" />
                                    </svg>
                                    Date of Test/Exam: {t.date}
                                </p>
                            </div>
                            <button
                                className="sc-delete-btn"
                                onClick={() => handleDelete(t)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}