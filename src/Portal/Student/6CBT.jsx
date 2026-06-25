import "./6CBT.css";

export default function StudentCBT() {
    return (
        <div className="cbt-page">
            <h1 className="cbt-title">CBT Test/Exam</h1>
            <p className="cbt-sub">Take your computer-based tests and exam</p>

            <div className="cbt-soon-card">
                <div className="cbt-soon-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                </div>
                <h2 className="cbt-soon-title">Coming Soon</h2>
                <p className="cbt-soon-text">
                    CBT Tests/Exams will be available here once it's ready. Check back soon!
                </p>
            </div>
        </div>
    );
}