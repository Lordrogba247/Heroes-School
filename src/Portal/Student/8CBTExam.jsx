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

    // Whether the student has clicked "Begin Exam" and fullscreen/timer has started
    const [examStarted, setExamStarted] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { [questionId]: "A" }

    const [secondsLeft, setSecondsLeft] = useState(null);
    const startTimeRef = useRef(null); // Date.now() when the exam actually started
    const timerRef = useRef(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [result, setResult] = useState(null); // { score, totalQuestions, percentage, passed }
    const hasSubmittedRef = useRef(false); // guards against double-submit (manual + timeout race)

    // Anti-cheat: violation modal + strike counters
    const [violation, setViolation] = useState(null); // { type: "focus"|"copy", final: boolean, message: string }
    const focusStrikesRef = useRef(0);
    const copyStrikesRef = useRef(0);

    const token = localStorage.getItem("token");

    // Fetch questions on mount (does NOT start the timer yet — that happens on "Begin Exam")
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
                setSecondsLeft((data.data.duration || 0) * 60);
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

            if (res.status === 400) {
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

    // Strike 1: warn. Strike 2: auto-submit. Used for leaving fullscreen / switching tabs.
    const handleFocusViolation = useCallback(() => {
        if (hasSubmittedRef.current || !examStarted || result) return;
        focusStrikesRef.current += 1;
        if (focusStrikesRef.current >= 2) {
            setViolation({
                type: "focus",
                final: true,
                message: "You left the test screen a second time. Your test is being submitted automatically.",
            });
            submitTest();
        } else {
            setViolation({
                type: "focus",
                final: false,
                message: "You left the test screen. Return to fullscreen now — doing this again will auto-submit your test.",
            });
        }
    }, [examStarted, result, submitTest]);

    // Strike 1: warn. Strike 2: auto-submit. Used for copy/cut attempts.
    const handleCopyAttempt = useCallback((e) => {
        e.preventDefault();
        if (hasSubmittedRef.current || !examStarted || result) return;
        copyStrikesRef.current += 1;
        if (copyStrikesRef.current >= 2) {
            setViolation({
                type: "copy",
                final: true,
                message: "You attempted to copy test content a second time. Your test is being submitted automatically.",
            });
            submitTest();
        } else {
            setViolation({
                type: "copy",
                final: false,
                message: "Copying is not allowed during the test. Attempting to copy again will auto-submit your test.",
            });
        }
    }, [examStarted, result, submitTest]);

    // Countdown timer — starts once examStarted is true, auto-submits at zero
    useEffect(() => {
        if (!examStarted || secondsLeft === null || result || loadError) return;

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
    }, [examStarted, secondsLeft !== null]);

    // Detect leaving fullscreen
    useEffect(() => {
        if (!examStarted) return;
        const onFsChange = () => {
            const inFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
            if (!inFullscreen) handleFocusViolation();
        };
        document.addEventListener("fullscreenchange", onFsChange);
        document.addEventListener("webkitfullscreenchange", onFsChange);
        return () => {
            document.removeEventListener("fullscreenchange", onFsChange);
            document.removeEventListener("webkitfullscreenchange", onFsChange);
        };
    }, [examStarted, handleFocusViolation]);

    // Detect tab switch / minimizing
    useEffect(() => {
        if (!examStarted) return;
        const onVisibility = () => {
            if (document.hidden) handleFocusViolation();
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, [examStarted, handleFocusViolation]);

    // Block copy/cut, right-click, and a few keyboard shortcuts during the exam
    useEffect(() => {
        if (!examStarted) return;

        const onContextMenu = (e) => e.preventDefault();
        const onKeyDown = (e) => {
            const key = e.key.toLowerCase();
            const blockedCombo = (e.ctrlKey || e.metaKey) && ["u", "s", "p"].includes(key);
            const devToolsCombo = (e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(key);
            if (e.key === "F12" || blockedCombo || devToolsCombo) e.preventDefault();
        };

        document.addEventListener("copy", handleCopyAttempt);
        document.addEventListener("cut", handleCopyAttempt);
        document.addEventListener("contextmenu", onContextMenu);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("copy", handleCopyAttempt);
            document.removeEventListener("cut", handleCopyAttempt);
            document.removeEventListener("contextmenu", onContextMenu);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [examStarted, handleCopyAttempt]);

    // Exit fullscreen once the test is done, and on unmount
    useEffect(() => {
        if (result && (document.fullscreenElement || document.webkitFullscreenElement)) {
            (document.exitFullscreen || document.webkitExitFullscreen)?.call(document).catch(() => { });
        }
    }, [result]);

    useEffect(() => {
        return () => {
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                (document.exitFullscreen || document.webkitExitFullscreen)?.call(document).catch(() => { });
            }
        };
    }, []);

    const handleBeginExam = async () => {
        try {
            const el = document.documentElement;
            const request = el.requestFullscreen || el.webkitRequestFullscreen;
            if (request) await request.call(el);
        } catch {
            // Some browsers/devices (notably iOS Safari) don't support fullscreen —
            // proceed anyway; tab-switch/copy detection still works.
        }
        startTimeRef.current = Date.now();
        setExamStarted(true);
    };

    const handleReturnToFullscreen = async () => {
        try {
            const el = document.documentElement;
            const request = el.requestFullscreen || el.webkitRequestFullscreen;
            if (request) await request.call(el);
        } catch {
            // ignore
        }
        setViolation(null);
    };

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

    const questions = examData?.questions || [];

    // Result screen (successful submission) — takes priority over everything else
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

    // Submit blocked (400 time expired) with no result payload
    if (submitError && !examStarted) {
        return (
            <div className="cbtx-page">
                <p className="cbtx-error">{submitError}</p>
                <button className="cbtx-back-btn" onClick={() => navigate("/portal/student/cbt")}>
                    ← Back to Tests
                </button>
            </div>
        );
    }

    // Ready screen — shown before fullscreen/timer starts
    if (examData && !examStarted) {
        return (
            <div className="cbtx-page">
                <div className="cbtx-ready-card">
                    <h2 className="cbtx-ready-title">{examData.subject}</h2>
                    <p className="cbtx-ready-sub">
                        {questions.length} questions · {examData.duration} minutes
                    </p>
                    <div className="cbtx-ready-rules">
                        <p>⚠ Once you begin, the test opens in fullscreen.</p>
                        <p>⚠ Leaving fullscreen or switching tabs twice auto-submits your test.</p>
                        <p>⚠ Attempting to copy test content twice auto-submits your test.</p>
                        <p>⚠ Right-click and copy/paste are disabled during the test.</p>
                    </div>
                    <button className="cbtx-begin-btn" onClick={handleBeginExam}>
                        Begin Exam
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="cbtx-page cbtx-page--locked">
            <div className="cbtx-header">
                <div>
                    <h1 className="cbtx-subject">{examData?.subject}</h1>
                    <p className="cbtx-progress">
                        Question {currentIndex + 1} of {questions.length} &nbsp;·&nbsp; {answeredCount} answered
                    </p>
                </div>
                <div className="cbtx-timer">{formatTime(secondsLeft)}</div>
            </div>

            {submitError && <p className="cbtx-error">{submitError}</p>}

            {currentQuestion && (
                <div className="cbtx-question-card">
                    <p className="cbtx-question-text">{currentQuestion.text}</p>
                    <div className="cbtx-options">
                        {currentQuestion.options.map((opt) => {
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
                    <button className="cbtx-submit-btn" onClick={handleManualSubmit} disabled={submitting}>
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

            {/* Violation warning modal */}
            {violation && !violation.final && (
                <div className="cbtx-violation-overlay">
                    <div className="cbtx-violation-modal">
                        <h3 className="cbtx-violation-title">⚠ Warning</h3>
                        <p className="cbtx-violation-text">{violation.message}</p>
                        <button className="cbtx-violation-btn" onClick={handleReturnToFullscreen}>
                            Return to Fullscreen & Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Final violation — submission already triggered, just inform them */}
            {violation && violation.final && (
                <div className="cbtx-violation-overlay">
                    <div className="cbtx-violation-modal cbtx-violation-modal--final">
                        <h3 className="cbtx-violation-title">Test Submitted</h3>
                        <p className="cbtx-violation-text">{violation.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}