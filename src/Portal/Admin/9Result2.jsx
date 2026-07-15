import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./9Result2.css";
import schoolLogo from "../../assets/logo2.png";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

const schoolInfo = {
    name: "HEROES COLLEGE & PRIMARY SCHOOL",
};

export default function AdminResultView() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { session, term, classLabel } = location.state || {
        session: "2025/2026",
        term: "Third Term",
        classLabel: "",
    };

    const [student, setStudent] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({ session, term });

        fetch(`${BASE_URL}/api/admin/results/${studentId}?${params}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("No result found for this student.");
                return res.json();
            })
            .then((data) => {
                // Confirmed shape: { success, data: { studentInfo, subjects, totalScore, percentage, comment } }
                const result = data.data || null;
                setStudent(result?.studentInfo || null);
                setResultData(result);
            })
            .catch((err) => setError(err.message || "Failed to load result."))
            .finally(() => setLoading(false));
    }, [studentId, session, term]);

    if (loading) return (
        <div className="adr2-page">
            <button className="adr2-back-btn" onClick={() => navigate("/portal/admin/results")}>
                ← Back to Results
            </button>
            <p>Loading result...</p>
        </div>
    );

    if (error || !resultData) return (
        <div className="adr2-page">
            <button className="adr2-back-btn" onClick={() => navigate("/portal/admin/results")}>
                ← Back to Results
            </button>
            <p className="adr2-error">{error || "No result found."}</p>
        </div>
    );

    return (
        <div className="adr2-page">
            <button className="adr2-back-btn" onClick={() => navigate("/portal/admin/results")}>
                ← Back to Results
            </button>

            <div className="adr2-card">
                {/* Letterhead */}
                <div className="adr2-letterhead">
                    <img src={schoolLogo} alt="Heroes College" className="adr2-letterhead-logo" />
                    <p className="adr2-letterhead-name">{schoolInfo.name}</p>
                </div>

                {/* Student info */}
                <div className="adr2-info-grid">
                    <p className="adr2-info-item"><span className="adr2-info-label">Name:</span> {student?.name}</p>
                    {/* Note: for this endpoint studentInfo.studentId is the human-readable
                        registration ID (e.g. HC/2026/XXXX), not the Mongo ObjectId */}
                    <p className="adr2-info-item"><span className="adr2-info-label">Student ID:</span> {student?.studentId}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Sex:</span> {student?.sex}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Session:</span> {session}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Term:</span> {term}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Class:</span> {student?.class || classLabel}</p>
                </div>

                {/* Subjects table */}
                <div className="adr2-table-wrap">
                    <table className="adr2-table">
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
                            {(resultData.subjects || []).map((s) => (
                                <tr key={s.name || s.subject}>
                                    <td className="adr2-subject-name">{s.name || s.subject}</td>
                                    <td>{s.ca1}</td>
                                    <td>{s.ca2}</td>
                                    <td>{s.exam}</td>
                                    <td>{s.total || s.percent}</td>
                                    <td>{s.grade}</td>
                                    <td>{s.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary stats */}
                <div className="adr2-stats">
                    <div className="adr2-stat-box">
                        <p className="adr2-stat-value">{resultData.subjects?.length}</p>
                        <p className="adr2-stat-label">Subjects</p>
                    </div>
                    <div className="adr2-stat-box">
                        <p className="adr2-stat-value">{resultData.totalScore}</p>
                        <p className="adr2-stat-label">Total Score</p>
                    </div>
                    <div className="adr2-stat-box">
                        <p className="adr2-stat-value">{resultData.percentage}</p>
                        <p className="adr2-stat-label">Percentage</p>
                    </div>
                </div>

                {/* Comment */}
                <div className="adr2-comment-section">
                    <p className="adr2-comment-label">Comment</p>
                    <p className="adr2-comment-text">{resultData.comment}</p>
                </div>
            </div>
        </div>
    );
}

