import { useState } from "react";
import "./5Result.css";
import schoolLogo from "../../assets/logo4.png";
import principalSign from "../../assets/sign1.png";
import api from "../../api";

const sessions = ["2024/2025", "2025/2026"];
const terms = ["First Term", "Second Term", "Third Term"];

export default function StudentResults() {
    const [session, setSession] = useState(sessions[1]);
    const [term, setTerm] = useState(terms[2]);
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCheckResults = async () => {
        setLoading(true);
        setError("");
        setResultData(null);
        try {
            const res = await api.get("/api/student/results", {
                params: { session, term },
            });
            setResultData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "No result found for the selected session and term.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="sr-page">
            <h1 className="sr-title">My Results</h1>
            <p className="sr-sub">Select Session &amp; Term to view your results</p>

            <div className="sr-selectors">
                <select className="sr-select" value={session} onChange={(e) => setSession(e.target.value)}>
                    {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="sr-select" value={term} onChange={(e) => setTerm(e.target.value)}>
                    {terms.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button className="sr-check-btn" onClick={handleCheckResults} disabled={loading}>
                    {loading ? "Loading..." : "Check Results"}
                </button>
            </div>

            {error && <p className="sr-fetch-error">{error}</p>}

            {resultData && (
                <div className="sr-card">
                    {/* Letterhead */}
                    <div className="sr-letterhead">
                        <img src={schoolLogo} alt="Heroes College" className="sr-letterhead-logo" />
                        <div className="sr-letterhead-text">
                            <p className="sr-letterhead-name">HEROES COLLEGE &amp; PRIMARY SCHOOL</p>
                            <p className="sr-letterhead-address"><span className="sr-lh-bold">School A:</span> 84, Gaa-Akanbi Road behind Erin-Ile Junction, Ilorin, Kwara State.</p>
                            <p className="sr-letterhead-address"><span className="sr-lh-bold">School B:</span> Redemption Road Gbogede, Amoyo, Kwara State.</p>
                            <p className="sr-letterhead-address"><span className="sr-lh-bold">Tel:</span> 08038607740, 08118958365, 08129807674, 07031259915.</p>
                            <p className="sr-letterhead-motto"><span className="sr-lh-bold">Motto:</span> serving God &amp; Humanity</p>
                        </div>
                    </div>

                    {/* Student info */}
                    <div className="sr-info-grid">
                        <p className="sr-info-item">
                            <span className="sr-info-label">Name:</span> {resultData.studentInfo?.name}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-label">Student ID:</span> {resultData.studentInfo?.studentId}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-label">Sex:</span> {resultData.studentInfo?.sex}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-label">Session:</span> {session}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-label">Term:</span> {term}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-label">Class:</span> {resultData.studentInfo?.class}
                        </p>
                    </div>

                    {/* Subjects table */}
                    <div className="sr-table-wrap">
                        <table className="sr-table">
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
                                {resultData.subjects?.map((s) => (
                                    <tr key={s.name}>
                                        <td className="sr-subject-name">{s.name}</td>
                                        <td>{s.ca1}</td>
                                        <td>{s.ca2}</td>
                                        <td>{s.exam}</td>
                                        <td>{s.percent}</td>
                                        <td>{s.grade}</td>
                                        <td>{s.remark}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary stats */}
                    <div className="sr-stats">
                        <div className="sr-stat-box">
                            <p className="sr-stat-value">{resultData.subjects?.length}</p>
                            <p className="sr-stat-label">Subjects</p>
                        </div>
                        <div className="sr-stat-box">
                            <p className="sr-stat-value">{resultData.totalScore}</p>
                            <p className="sr-stat-label">Total Score</p>
                        </div>
                        <div className="sr-stat-box">
                            <p className="sr-stat-value">{resultData.percentage}</p>
                            <p className="sr-stat-label">Percentage</p>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="sr-comment-section">
                        <p className="sr-comment-label">Comment</p>
                        <p className="sr-comment-text">{resultData.comment}</p>
                        <img src={principalSign} alt="Principal Signature" className="sr-signature1" />
                        <p className="sr-signature">Principal's Signature</p>
                    </div>

                    {/* Print button */}
                    <div className="sr-print-row">
                        <button className="sr-print-btn" onClick={handlePrint}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="#fff" d="M18 7H6V3h12zm0 5.5q.425 0 .713-.288T19 11.5t-.288-.712T18 10.5t-.712.288T17 11.5t.288.713t.712.287M16 19v-4H8v4zm2 2H6v-4H2v-6q0-1.275.875-2.137T5 8h14q1.275 0 2.138.863T22 11v6h-4z" />
                            </svg>
                            Print Result
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}