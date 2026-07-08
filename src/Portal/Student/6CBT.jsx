import { useState, useEffect } from "react";
import "./6CBT.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

export default function StudentCBT() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/api/cbt`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load CBT tests.");
                return res.json();
            })
            .then((data) => setTests(data.tests || data || []))
            .catch((err) => setError(err.message || "Failed to load CBT tests."))
            .finally(() => setLoading(false));
    }, []);

    const handleStartTest = (test) => {
        // Backend dev go wire this to the CBT test-taking screen when it's ready
        alert(`Starting: ${test.subject} — ${test.description}`);
    };

    if (loading) return (
        <div className="cbt-page">
            <h1 className="cbt-title">CBT Test/Exam</h1>
            <p className="cbt-sub">Take your computer-based tests and exam</p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "#888" }}>Loading...</p>
        </div>
    );

    if (error) return (
        <div className="cbt-page">
            <h1 className="cbt-title">CBT Test/Exam</h1>
            <p className="cbt-sub">Take your computer-based tests and exam</p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "#c0392b" }}>{error}</p>
        </div>
    );

    return (
        <div className="cbt-page">
            <h1 className="cbt-title">CBT Test/Exam</h1>
            <p className="cbt-sub">Take your computer-based tests and exam</p>

            {tests.length === 0 ? (
                <div className="cbt-soon-card">
                    <div className="cbt-soon-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                    </div>
                    <h2 className="cbt-soon-title">No Tests Available</h2>
                    <p className="cbt-soon-text">
                        No CBT Tests/Exams have been scheduled for your class yet. Check back soon!
                    </p>
                </div>
            ) : (
                <div className="cbt-list">
                    {/* Warning banner */}
                    <div className="cbt-warning">
                        <span className="cbt-warning-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                        </span>
                        <p className="cbt-warning-text">
                            <span className="cbt-warning-bold">Important:</span> Once you start an exam, you cannot pause it. Ensure you have a stable internet connection and sufficient time to complete the exam. The timer will start immediately upon clicking "Start Exam".
                        </p>
                    </div>

                    {tests.map((test) => (
                        <div className="cbt-card" key={test._id || test.id}>
                            <div className="cbt-card-header">
                                <p className="cbt-card-subject">{test.subject}</p>
                                <p className="cbt-card-type">{test.description}</p>
                            </div>
                            <div className="cbt-card-body">
                                <p className="cbt-meta-row">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                    Duration: {test.duration}mins
                                </p>
                                <p className="cbt-meta-row">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                                    </svg>
                                    Questions: {test.questions}
                                </p>
                                <p className="cbt-meta-row">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                                    </svg>
                                    Date of Test/Exam: {test.date}
                                </p>
                                <button className="cbt-start-btn" onClick={() => handleStartTest(test)}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Start Test/Exam
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}