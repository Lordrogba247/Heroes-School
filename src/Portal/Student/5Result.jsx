import { useState } from "react";
import "./5Result.css";
import schoolLogo from "../../assets/logo4.png";
import principalSign from "../../assets/sign1.png"

const studentInfo = {
    name: "Chukwuemeka Jemima",
    studentId: "HC/2025/01358",
    sex: "Female",
    class: "SS2",
};

const schoolInfo = {
    name: "HEROES COLLEGE & PRIMARY SCHOOL",
    addressA: "School A: 84, Gaa-Akanbi Road behind Erin-Ile Junction, Ilorin, Kwara State.",
    addressB: "School B: Redemption Road Gbogede, Amoyo, Kwara State.",
    tel: "Tel: 08038607740, 08118958365, 08129807674, 07031259915.",
    motto: "Motto: serving God & Humanity",
};

const resultData = {
    subjects: [
        { name: "English Language", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "V.Good" },
        { name: "Mathematics", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "Good" },
        { name: "Chemistry", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "Good" },
        { name: "Physics", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "Good" },
        { name: "Biology", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "Good" },
        { name: "Government", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "Good" },
        { name: "Financial Account", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "Good" },
        { name: "Yoruba", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "B2", remark: "Good" },
        { name: "Literature-In-English", ca1: 15, ca2: 12, exam: 40, total: 67, percent: 83, grade: "A1", remark: "Excellent" },
    ],
    totalScore: 1578,
    percentage: "89.5%",
    comment: "Chukwuemeka is active in class and hardworking girl, keep it up, you can do better!",
};

const sessions = ["2024/2025", "2025/2026"];
const terms = ["First Term", "Second Term", "Third Term"];

export default function StudentResults() {
    const [session, setSession] = useState(sessions[1]);
    const [term, setTerm] = useState(terms[2]);
    const [showResults, setShowResults] = useState(false);

    const handleCheckResults = () => {
        setShowResults(false);
        setTimeout(() => setShowResults(true), 0);
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
                    {sessions.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                <select className="sr-select" value={term} onChange={(e) => setTerm(e.target.value)}>
                    {terms.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
                <button className="sr-check-btn" onClick={handleCheckResults}>Check Results</button>
            </div>

            {showResults && (
                <div className="sr-card">
                    {/* Letterhead */}
                    <div className="sr-letterhead">
                        <img src={schoolLogo} alt="Heroes College" className="sr-letterhead-logo" />
                        <div className="sr-letterhead-text">
                            <p className="sr-letterhead-name">{schoolInfo.name}</p>
                            <p className="sr-letterhead-address"><span className="sr-lh-bold">School A:</span> 84, Gaa-Akanbi Road behind Erin-Ile Junction, Ilorin, Kwara State.</p>
                            <p className="sr-letterhead-address"><span className="sr-lh-bold">School B:</span> Redemption Road Gbogede, Amoyo, Kwara State.</p>
                            <p className="sr-letterhead-address"><span className="sr-lh-bold">Tel:</span> 08038607740, 08118958365, 08129807674, 07031259915.</p>
                            <p className="sr-letterhead-motto"><span className="sr-lh-bold">Motto:</span> serving God &amp; Humanity</p>
                        </div>
                    </div>

                    {/* Student info */}
                    <div className="sr-info-grid">
                        <p className="sr-info-item">
                            <span className="sr-info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path fill="#112562" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <span className="sr-info-label">Name:</span> {studentInfo.name}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 15 15">
                                    <path d="M0 0h15v15H0z" fill="none" />
                                    <path fill="#112562" fillRule="evenodd" d="M0 3.5A1.5 1.5 0 0 1 1.5 2h12A1.5 1.5 0 0 1 15 3.5v8a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 11.5zM3 6a2 2 0 1 1 4 0a2 2 0 0 1-4 0m9 0H9V5h3zm0 3H9V8h3zM5 9a2.93 2.93 0 0 0-2.618 1.618l-.33.658A.5.5 0 0 0 2.5 12h5a.5.5 0 0 0 .447-.724l-.329-.658A2.93 2.93 0 0 0 5 9" clipRule="evenodd" />
                                </svg>
                            </span>
                            <span className="sr-info-label">Student ID:</span> {studentInfo.studentId}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48">
                                    <path d="M0 0h48v48H0z" fill="none" />
                                    <path fill="#112562" fillRule="evenodd" d="M42.406 2.976A2.423 2.423 0 0 0 39.91.481a67 67 0 0 0-6.371.507c-.833.106-1.523.61-1.819 1.35c-.3.75-.137 1.598.436 2.242c.325.367.725.802 1.216 1.317l-4.254 4.254a14.68 14.68 0 0 0-8.784-2.902c-8.142 0-14.742 6.6-14.742 14.741c0 7.36 5.393 13.459 12.442 14.563v2.46h-1.606a2.3 2.3 0 0 0 0 4.601h1.606v1.605a2.3 2.3 0 0 0 4.601 0v-1.605h1.606a2.301 2.301 0 0 0 0-4.602h-1.606v-2.46c7.049-1.104 12.44-7.203 12.44-14.562c0-3.003-.898-5.796-2.44-8.125L37.001 9.5c.511.48.946.874 1.313 1.197c.66.58 1.524.731 2.278.416c.741-.31 1.241-1.015 1.338-1.859c.2-1.74.408-3.964.476-6.279M20.335 11.34c-5.883 0-10.651 4.769-10.651 10.651s4.768 10.65 10.65 10.65s10.651-4.768 10.651-10.65s-4.768-10.65-10.65-10.65" clipRule="evenodd" />
                                </svg>
                            </span>
                            <span className="sr-info-label">Sex:</span> {studentInfo.sex}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path fill="none" stroke="#112562" strokeDasharray="66" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z">
                                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
                                    </path>
                                    <path fill="#112562" d="M5 5h14v0h-14Z">
                                        <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" to="M5 5h14v3h-14Z" />
                                    </path>
                                    <g fill="none" stroke="#112562" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                        <path strokeDasharray="4" strokeDashoffset="4" d="M7 4v-2M17 4v-2">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                        </path>
                                        <path strokeDasharray="12" strokeDashoffset="12" d="M7 11h10">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                        </path>
                                        <path strokeDasharray="10" strokeDashoffset="10" d="M7 15h7">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                        </path>
                                    </g>
                                </svg>
                            </span>
                            <span className="sr-info-label">Session:</span> {session}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path fill="none" stroke="#112562" strokeDasharray="66" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z">
                                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
                                    </path>
                                    <path fill="#112562" d="M5 5h14v0h-14Z">
                                        <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" to="M5 5h14v3h-14Z" />
                                    </path>
                                    <g fill="none" stroke="#112562" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                        <path strokeDasharray="4" strokeDashoffset="4" d="M7 4v-2M17 4v-2">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                        </path>
                                        <path strokeDasharray="12" strokeDashoffset="12" d="M7 11h10">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                        </path>
                                        <path strokeDasharray="10" strokeDashoffset="10" d="M7 15h7">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                        </path>
                                    </g>
                                </svg>
                            </span>
                            <span className="sr-info-label">Term:</span> {term}
                        </p>
                        <p className="sr-info-item">
                            <span className="sr-info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512">
                                    <path d="M0 0h512v512H0z" fill="none" />
                                    <path fill="#112562" d="M169 57v430h78V57zM25 105v190h46V105zm158 23h18v320h-18zm128.725 7.69l-45.276 8.124l61.825 344.497l45.276-8.124zM89 153v270h62V153zm281.502 28.68l-27.594 11.773l5.494 12.877l27.594-11.773zm12.56 29.433l-27.597 11.772l5.494 12.877l27.593-11.772l-5.492-12.877zm12.555 29.434l-27.594 11.77l99.674 233.628l27.594-11.773zM25 313v30h46v-30zm190 7h18v128h-18zM25 361v126h46V361zm64 80v46h62v-46z" />
                                </svg>
                            </span>
                            <span className="sr-info-label">Class:</span> {studentInfo.class}
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
                                {resultData.subjects.map((s) => (
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
                            <p className="sr-stat-value">{resultData.subjects.length}</p>
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