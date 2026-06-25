import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./8Result2.css";

// Mock students data
const studentsData = [
    { id: 1, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01324", sex: "M", classLabel: "JSS2" },
    { id: 2, name: "Adekoya Bimbo Mosunmola", studentId: "HC/2025/01325", sex: "F", classLabel: "JSS2" },
    { id: 3, name: "Temidire Audu Ali", studentId: "HC/2025/01326", sex: "M", classLabel: "JSS2" },
    { id: 4, name: "Richard Judith emenembo", studentId: "HC/2025/01314", sex: "F", classLabel: "JSS2" },
    { id: 5, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01354", sex: "M", classLabel: "JSS2" },
    { id: 6, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01327", sex: "M", classLabel: "JSS2" },
    { id: 7, name: "Abdulafeez Simbiat Rukayat", studentId: "HC/2025/01424", sex: "F", classLabel: "JSS2" },
    { id: 8, name: "Luke Demilade Mary", studentId: "HC/2025/01320", sex: "F", classLabel: "JSS2" },
    { id: 9, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01328", sex: "M", classLabel: "JSS2" },
    { id: 10, name: "Tijesunimi Irede Dorcas", studentId: "HC/2025/01340", sex: "F", classLabel: "JSS2" },
];

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

const sessions = ["2024/2025", "2025/2026"];
const terms = ["First Term", "Second Term", "Third Term"];

function getGrade(total) {
    if (total >= 75) return { grade: "A1", remark: "Excellent" };
    if (total >= 70) return { grade: "B2", remark: "V.Good" };
    if (total >= 65) return { grade: "B3", remark: "Good" };
    if (total >= 60) return { grade: "C4", remark: "Credit" };
    if (total >= 55) return { grade: "C5", remark: "Credit" };
    if (total >= 50) return { grade: "C6", remark: "Credit" };
    if (total >= 45) return { grade: "D7", remark: "Pass" };
    if (total >= 40) return { grade: "E8", remark: "Pass" };
    return { grade: "F9", remark: "Fail" };
}

const emptyRowInput = { subject: "", ca1: "", ca2: "", exam: "" };

export default function StaffResultEntry() {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const student = studentsData.find((s) => String(s.id) === studentId) || studentsData[0];

    const [session, setSession] = useState(sessions[1]);
    const [term, setTerm] = useState(terms[2]);
    const [rowInput, setRowInput] = useState(emptyRowInput);
    const [results, setResults] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleRowChange = (field, value) => {
        setRowInput((prev) => ({ ...prev, [field]: value }));
    };

    const resetRowInput = () => {
        setRowInput(emptyRowInput);
        setEditingId(null);
    };

    const handleAddResult = () => {
        const { subject, ca1, ca2, exam } = rowInput;
        if (!subject || ca1 === "" || ca2 === "" || exam === "") return;

        const ca1Num = Number(ca1);
        const ca2Num = Number(ca2);
        const examNum = Number(exam);
        const total = ca1Num + ca2Num + examNum;
        const { grade, remark } = getGrade(total);

        if (editingId) {
            setResults((prev) =>
                prev.map((r) =>
                    r.id === editingId
                        ? { ...r, subject, ca1: ca1Num, ca2: ca2Num, exam: examNum, total, grade, remark }
                        : r
                )
            );
        } else {
            setResults((prev) => [
                ...prev,
                { id: Date.now(), subject, ca1: ca1Num, ca2: ca2Num, exam: examNum, total, grade, remark },
            ]);
        }

        resetRowInput();
    };

    const handleEditRow = (row) => {
        setEditingId(row.id);
        setRowInput({
            subject: row.subject,
            ca1: String(row.ca1),
            ca2: String(row.ca2),
            exam: String(row.exam),
        });
    };

    const handleDeleteRow = (id) => {
        setResults((prev) => prev.filter((r) => r.id !== id));
        if (editingId === id) resetRowInput();
    };

    const handleAddComment = () => {
        if (!commentInput.trim()) return;
        setComments((prev) => [
            ...prev,
            { id: Date.now(), text: commentInput, timestamp: new Date().toLocaleString() }
        ]);
        setCommentInput("");
    };

    const livePreview = (() => {
        const { ca1, ca2, exam } = rowInput;
        if (ca1 === "" || ca2 === "" || exam === "") return null;
        const total = Number(ca1) + Number(ca2) + Number(exam);
        return { total, ...getGrade(total) };
    })();

    const handleSubmitResult = () => {
        if (results.length === 0) return;
        // Backend dev go POST results + comments here
        // POST /api/staff/results with { studentId, session, term, results, comments }
        setSubmitted(true);
    };

    return (
        <div className="sre-page">
            <button className="sre-back-btn" onClick={() => navigate("/portal/staff/results")}>
                ← Back to Students
            </button>

            <h1 className="sre-title">{student.name}</h1>
            <p className="sre-sub">
                {student.studentId} &nbsp; {student.sex} &nbsp; {student.classLabel}
            </p>

            {/* Session / Term */}
            <div className="sre-top-row">
                <select
                    className="sre-select"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    disabled={submitted}
                >
                    {sessions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="sre-select"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    disabled={submitted}
                >
                    {terms.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            {/* Row input table */}
            {!submitted && (
                <div className="sre-input-table-wrap">
                    <table className="sre-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>1st C.A (20)</th>
                                <th>2nd C.A (20)</th>
                                <th>Exam (60)</th>
                                <th>Total (100)</th>
                                <th>Grade</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select
                                        className="sre-cell-select"
                                        value={rowInput.subject}
                                        onChange={(e) => handleRowChange("subject", e.target.value)}
                                    >
                                        <option value="" disabled>Subject</option>
                                        {subjectOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        className="sre-cell-input"
                                        value={rowInput.ca1}
                                        onChange={(e) => handleRowChange("ca1", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        className="sre-cell-input"
                                        value={rowInput.ca2}
                                        onChange={(e) => handleRowChange("ca2", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="60"
                                        className="sre-cell-input"
                                        value={rowInput.exam}
                                        onChange={(e) => handleRowChange("exam", e.target.value)}
                                    />
                                </td>
                                <td className="sre-readonly-cell">{livePreview ? livePreview.total : "—"}</td>
                                <td className="sre-readonly-cell">{livePreview ? livePreview.grade : "—"}</td>
                                <td className="sre-readonly-cell">{livePreview ? livePreview.remark : "—"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <button className="sre-add-result-btn" onClick={handleAddResult}>
                        {editingId ? "Save Result" : "Add result"}
                    </button>
                </div>
            )}

            {/* Results table */}
            {results.length > 0 && (
                <div className="sre-results-table-wrap">
                    <table className="sre-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>1st C.A (20)</th>
                                <th>2nd C.A (20)</th>
                                <th>Exam (60)</th>
                                <th>Total (100)</th>
                                <th>Grade</th>
                                <th>Remark</th>
                                {!submitted && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr key={r.id}>
                                    <td className="sre-subject-cell">{r.subject}</td>
                                    <td>{r.ca1}</td>
                                    <td>{r.ca2}</td>
                                    <td>{r.exam}</td>
                                    <td>{r.total}</td>
                                    <td>{r.grade}</td>
                                    <td>{r.remark}</td>
                                    {!submitted && (
                                        <td>
                                            <div className="sre-row-actions">
                                                <button
                                                    className="sre-icon-btn sre-icon-btn--edit"
                                                    onClick={() => handleEditRow(r)}
                                                    aria-label="Edit result"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                                                        <path d="M0 0h1024v1024H0z" fill="none" />
                                                        <path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9m67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32" />
                                                    </svg>

                                                </button>
                                                <button
                                                    className="sre-icon-btn sre-icon-btn--delete"
                                                    onClick={() => handleDeleteRow(r.id)}
                                                    aria-label="Delete result"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                        <path d="M0 0h24v24H0z" fill="none" />
                                                        <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Comment */}
            <div className="sre-comment-row">
                <input
                    type="text"
                    className="sre-comment-input"
                    placeholder="Add a comment on this student's performance..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    disabled={submitted}
                />
                <button
                    className="sre-comment-btn"
                    onClick={handleAddComment}
                    disabled={submitted || !commentInput.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20m3-9h-2V9a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2" />
                    </svg>
                    Add Comment

                </button>
            </div>

            {/* Comments list */}
            {comments.length > 0 && (
                <div className="sre-comments-list">
                    {comments.map((c) => (
                        <div key={c.id} className="sre-comment-item">
                            <p className="sre-comment-text">{c.text}</p>
                            <span className="sre-comment-time">{c.timestamp}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Warning */}
            <div className="sre-warning">
                <span className="sre-warning-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10M12 7a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1m-1 9a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1" clip-rule="evenodd" />
                    </svg>
                </span>
                <p className="sre-warning-text">
                    <span className="sre-warning-bold">Important:</span> You cannot Edit this student result after you Submit the result.
                </p>
            </div>

            {/* Submit */}
            <button
                className="sre-submit-btn"
                onClick={handleSubmitResult}
                disabled={submitted || results.length === 0}
            >
                {submitted ? "✓ Result Submitted" : "Submit result"}
            </button>
        </div>
    );
}