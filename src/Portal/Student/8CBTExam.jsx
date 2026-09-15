import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./8CBTExam.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

export default function StudentCBTExam() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const passedTest = location.state?.test;

    const [examData, setExamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { [questionId]: "A" }

    const [secondsLeft, setSecondsLeft] = useState(null);
    const startTimeRef = useRef(null); // Date.now() when the exam actually started
    const timerRef = useRef(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [result, setResult] = useState(null); // { score, totalQuestions, percentage, passed }
    const hasSubmittedRef = useRef(false); // guards against double-submit (manual + timeout race)

    const token = localStorage.getItem("token");

    // Fetch questions on mount
    useEffect(() => {
        setLoading(true);
        setLoadError("");
        fetch(`${BASE_URL}/api/cbt/${testId}/questions`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || "Failed to load test questions.");
                return data;
            })
            .then((data) => {
                setExamData(data.data);
                const durationSeconds = (data.data.duration || 0) * 60;
                setSecondsLeft(durationSeconds);
                startTimeRef.current = Date.now();
            })
            .catch((err) => setLoadError(err.message || "Failed to load test questions."))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testId]);

    const buildAnswersPayload = useCallback(() => {
        return Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected }));
    }, [answers]);

    const getElapsedSeconds = useCallback(() => {
        if (!startTimeRef.current) return 0;
        return Math.round((Date.now() - startTimeRef.current) / 1000);
    }, []);

    const submitTest = useCallback(async () => {
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);

        setSubmitting(true);
        setSubmitError("");
        try {
            const res = await fetch(`${BASE_URL}/api/cbt/${testId}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    answers: buildAnswersPayload(),
                    timeTakenSeconds: getElapsedSeconds(),
                }),
            });
            const data = await res.json().catch(() => ({}));

            if (res.status === 409) {
                // Already submitted — treat as informational, send them to results
                setSubmitError(data.message || "You have already submitted this test.");
                setResult(null);
                return;
            }
            if (res.status === 400) {
                // Time expired per server check
                setSubmitError(data.message || "Time expired for this test.");
                setResult(null);
                return;
            }
            if (!res.ok) throw new Error(data.message || "Failed to submit test.");

            setResult(data.data);
        } catch (err) {
            setSubmitError(err.message || "Failed to submit test. Please try again.");
            hasSubmittedRef.current = false; // allow retry on genuine network/error failures
        } finally {
            setSubmitting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testId, buildAnswersPayload, getElapsedSeconds]);

    // Countdown timer — auto-submits when it hits zero
    useEffect(() => {
        if (secondsLeft === null || result || loadError) return;

        timerRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsLeft !== null]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleSelectOption = (questionId, optionLabel) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionLabel }));
    };

    const handleManualSubmit = () => {
        if (submitting) return;
        const unanswered = (examData?.questions || []).length - Object.keys(answers).length;
        if (unanswered > 0) {
            const proceed = window.confirm(
                `You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Submit anyway?`
            );
            if (!proceed) return;
        }
        submitTest();
    };

    if (loading) {
        return (
            <div className="cbtx-page">
                <p>Loading exam...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="cbtx-page">
                <p className="cbtx-error">{loadError}</p>
                <button className="cbtx-back-btn" onClick={() => navigate("/portal/student/cbt")}>
                    ← Back to Tests
                </button>
            </div>
        );
    }

    // Result screen (successful submission)
    if (result) {
        return (
            <div className="cbtx-page">
                <div className="cbtx-result-card">
                    <h2 className="cbtx-result-title">Test Submitted</h2>
                    <p className="cbtx-result-subject">{examData?.subject || passedTest?.subject}</p>
                    <div className="cbtx-result-stats">
                        <div className="cbtx-stat-box">
                            <p className="cbtx-stat-value">{result.score}</p>
                            <p className="cbtx-stat-label">Score</p>
                        </div>
                        <div className="cbtx-stat-box">
                            <p className="cbtx-stat-value">{result.totalQuestions}</p>
                            <p className="cbtx-stat-label">Total Questions</p>
                        </div>
                        <div className="cbtx-stat-box">
                            <p className="cbtx-stat-value">{result.percentage}%</p>
                            <p className="cbtx-stat-label">Percentage</p>
                        </div>
                    </div>
                    {typeof result.passed === "boolean" && (
                        <p className={`cbtx-result-verdict ${result.passed ? "cbtx-pass" : "cbtx-fail"}`}>
                            {result.passed ? "Passed" : "Not Passed"}
                        </p>
                    )}
                    <button className="cbtx-back-btn" onClick={() => navigate("/portal/student/cbt")}>
                        ← Back to Tests
                    </button>
                </div>
            </div>
        );
    }

    // Submit blocked (409 already submitted, or 400 time expired) with no result payload
    if (submitError && !examData) {
        return (
            <div className="cbtx-page">
                <p className="cbtx-error">{submitError}</p>
                <button className="cbtx-back-btn" onClick={() => navigate("/portal/student/cbt")}>
                    ← Back to Tests
                </button>
            </div>
        );
    }

    const questions = examData?.questions || [];
    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="cbtx-page">
            <div className="cbtx-header">
                <div>
                    <h1 className="cbtx-subject">{examData?.subject}</h1>
                    <p className="cbtx-progress">
                        Question {currentIndex + 1} of {questions.length} &nbsp;·&nbsp; {answeredCount} answered
                    </p>
                </div>
                <div className="cbtx-timer">{formatTime(secondsLeft)}</div>
            </div>

            {submitError && (
                <p className="cbtx-error">{submitError}</p>
            )}

            {currentQuestion && (
                <div className="cbtx-question-card">
                    <p className="cbtx-question-text">{currentQuestion.text}</p>
                    <div className="cbtx-options">
                        {currentQuestion.options.map((opt) => {
                            // Options come as "A. Water" — derive the letter for the payload
                            const letter = opt.trim().charAt(0);
                            const isSelected = answers[currentQuestion.id] === letter;
                            return (
                                <button
                                    key={opt}
                                    className={`cbtx-option ${isSelected ? "cbtx-option--selected" : ""}`}
                                    onClick={() => handleSelectOption(currentQuestion.id, letter)}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="cbtx-nav">
                <button
                    className="cbtx-nav-btn"
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                    <button
                        className="cbtx-nav-btn cbtx-nav-btn--primary"
                        onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        className="cbtx-submit-btn"
                        onClick={handleManualSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Test"}
                    </button>
                )}
            </div>

            <div className="cbtx-jumper">
                {questions.map((q, i) => (
                    <button
                        key={q.id}
                        className={`cbtx-jumper-dot ${i === currentIndex ? "cbtx-jumper-dot--current" : ""} ${answers[q.id] ? "cbtx-jumper-dot--answered" : ""}`}
                        onClick={() => setCurrentIndex(i)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}