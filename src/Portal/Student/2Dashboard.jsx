import "./2Dashboard.css";

// Mock data — backend dev go replace with real API data
const stats = [
    {
        id: "assignments",
        count: 125,
        label: "Active\nAssignments",
        accent: "purple",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
                <path d="M0 0h512v512H0z" fill="none" />
                <path fill="#9577c9" d="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 0 0-17.92 5.33A32 32 0 0 0 16 79.9V366c0 19.34 13.76 33.93 32 33.93c71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 0 0 6.94-3V106.82a15.9 15.9 0 0 0-5.46-12A143 143 0 0 0 202.24 74m279.68-20.7A31.33 31.33 0 0 0 464 48c-67.61.3-118.11 8.71-154.24 26a143.3 143.3 0 0 0-32.31 20.78a15.93 15.93 0 0 0-5.45 12v337.13a3.93 3.93 0 0 0 6.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0 0 32-32v-288a32 32 0 0 0-14.12-26.61" />
            </svg>

        ),
    },
    {
        id: "online",
        count: 7,
        label: "Online Classes",
        accent: "navy",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
        ),
    },
    {
        id: "cbt",
        count: 2,
        label: "upcoming\nCBT Tests/Exam",
        accent: "red",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
        ),
    },
];

const recentAssignments = [
    {
        id: 1,
        subject: "Basic Science",
        due: "To be submitted  July 12, 2026",
        status: "Active",
    },
];

const cbtTests = [
    {
        id: 1,
        subject: "English Language",
        detail: "2026/2027 . First Term . 1st C.A Test",
        status: "Expired",
    },
];

export default function StudentDashboard() {
    return (
        <div className="sd-page">
            <h1 className="sd-welcome">Welcome, Chukwuemeka</h1>
            <p className="sd-sub">Here's What's happening with your studies today!</p>

            {/* Stat cards */}
            <div className="sd-stats">
                {stats.map((s) => (
                    <div className={`sd-stat-card sd-stat-card--${s.accent}`} key={s.id}>
                        <div className={`sd-stat-icon sd-stat-icon--${s.accent}`}>{s.icon}</div>
                        <div className="sd-stat-info">
                            <span className={`sd-stat-count sd-stat-count--${s.accent}`}>
                                {s.count}
                            </span>
                            <span className="sd-stat-label">{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom panels */}
            <div className="sd-panels">
                {/* Recent Assignments */}
                <div className="sd-panel">
                    <div className="sd-panel-header sd-panel-header--navy">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                            <path d="M0 0h20v20H0z" fill="none" />
                            <path fill="#ffffff" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                        </svg>

                        <div>
                            <p className="sd-panel-title">Recent Assignments</p>
                            <p className="sd-panel-subtitle">Stay on top of your assignments</p>
                        </div>
                    </div>
                    <div className="sd-panel-body">
                        {recentAssignments.map((a) => (
                            <div className="sd-item" key={a.id}>
                                <div className="sd-item-icon sd-item-icon--navy">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                        <path d="M0 0h20v20H0z" fill="none" />
                                        <path fill="#112562" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                                    </svg>

                                </div>
                                <div className="sd-item-info">
                                    <p className="sd-item-title">{a.subject}</p>
                                    <p className="sd-item-meta">{a.due}</p>
                                </div>
                                <span className={`sd-badge sd-badge--active`}>{a.status}</span>
                            </div>
                        ))}
                        <div className="sd-view-all">
                            <a href="/portal/student/assignments">View all →</a>
                        </div>
                    </div>
                </div>

                {/* CBT Tests */}
                <div className="sd-panel">
                    <div className="sd-panel-header sd-panel-header--red">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                        </svg>
                        <div>
                            <p className="sd-panel-title">CBT Tests/Exams</p>
                            <p className="sd-panel-subtitle">Take your Computer-based Tests/Exams</p>
                        </div>
                    </div>
                    <div className="sd-panel-body">
                        {cbtTests.map((t) => (
                            <div className="sd-item" key={t.id}>
                                <div className="sd-item-icon sd-item-icon--red">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                </div>
                                <div className="sd-item-info">
                                    <p className="sd-item-title">{t.subject}</p>
                                    <p className="sd-item-meta">{t.detail}</p>
                                </div>
                                <span className={`sd-badge sd-badge--expired`}>{t.status}</span>
                            </div>
                        ))}
                        <div className="sd-view-all">
                            <a href="/portal/student/cbt">View all →</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}