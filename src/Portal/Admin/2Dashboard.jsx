import { Link } from "react-router-dom";
import "./2Dashboard.css";

// Mock dashboard data — backend dev go replace with real API.
// These should update in real-time as students/staff/classes/assignments are added or removed.
const admin = {
    firstName: "Danladi",
};

const stats = {
    activeStudents: 184,
    onlineClasses: 7,
    upcomingCbt: 2,
    activeStaff: 78,
    classesAvailable: 16,
    activeAssignments: 125,
};

const recentAssignment = {
    subject: "Basic Science",
    classLabel: "SS1",
    due: "July 12, 2026",
    status: "Active",
};

const recentCbt = {
    subject: "English Language",
    type: "2026/2027 . First Term . 1st C.A Test",
    status: "Expired",
};

export default function AdminDashboard() {
    return (
        <div className="ad-page">
            <h1 className="ad-title">Welcome, {admin.firstName}</h1>
            <p className="ad-sub">Here's What's happening wih your School today!</p>

            {/* Stats grid — 6 cards */}
            <div className="ad-stats">
                <div className="ad-stat-card">
                    <div className="ad-stat-icon ad-stat-icon--purple">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="2em" height="2em">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div>
                        <p className="ad-stat-value">{stats.activeStudents}</p>
                        <p className="ad-stat-label">Active Students</p>
                    </div>
                </div>

                <div className="ad-stat-card">
                    <div className="ad-stat-icon ad-stat-icon--navy">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </div>
                    <div>
                        <p className="ad-stat-value">{stats.onlineClasses}</p>
                        <p className="ad-stat-label">Online Classes</p>
                    </div>
                </div>

                <div className="ad-stat-card">
                    <div className="ad-stat-icon ad-stat-icon--red">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                        </svg>
                    </div>
                    <div>
                        <p className="ad-stat-value ad-stat-value--red">{stats.upcomingCbt}</p>
                        <p className="ad-stat-label">upcoming CBT Tests/Exam</p>
                    </div>
                </div>

                <div className="ad-stat-card">
                    <div className="ad-stat-icon ad-stat-icon--purple">
                        <svg viewBox="0 0 24 24" fill="#112562" width="2em" height="2em">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div>
                        <p className="ad-stat-value">{stats.activeStaff}</p>
                        <p className="ad-stat-label">Active Staff</p>
                    </div>
                </div>

                <div className="ad-stat-card">
                    <div className="ad-stat-icon ad-stat-icon--red">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512">
                            <path d="M0 0h512v512H0z" fill="none" />
                            <path fill="currentColor" d="M169 57v430h78V57zM25 105v190h46V105zm158 23h18v320h-18zm128.725 7.69l-45.276 8.124l61.825 344.497l45.276-8.124zM89 153v270h62V153zm281.502 28.68l-27.594 11.773l5.494 12.877l27.594-11.773zm12.56 29.433l-27.597 11.772l5.494 12.877l27.593-11.772l-5.492-12.877zm12.555 29.434l-27.594 11.77l99.674 233.628l27.594-11.773zM25 313v30h46v-30zm190 7h18v128h-18zM25 361v126h46V361zm64 80v46h62v-46z" />
                        </svg>

                    </div>
                    <div>
                        <p className="ad-stat-value ad-stat-value--red">{stats.classesAvailable}</p>
                        <p className="ad-stat-label">Classes Available</p>
                    </div>
                </div>

                <div className="ad-stat-card">
                    <div className="ad-stat-icon ad-stat-icon--purple">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path fill="currentColor" d="M22 16.653c0 .25-.05.5-.15.73a2 2 0 0 1-.41.62c-.181.171-.391.31-.62.41a1.9 1.9 0 0 1-.74.14a15.2 15.2 0 0 0-3.37.32a9.3 9.3 0 0 0-3.71 1.27V5.233c1.091-.52 2.26-.858 3.46-1a17.4 17.4 0 0 1 3.71-.33a1.92 1.92 0 0 1 1.3.61c.33.352.513.817.51 1.3zM11 5.233v14.91a9.25 9.25 0 0 0-3.65-1.27a16.2 16.2 0 0 0-3.43-.32a1.9 1.9 0 0 1-.74-.14a2.2 2.2 0 0 1-.62-.41a1.8 1.8 0 0 1-.41-.62a1.8 1.8 0 0 1-.15-.73v-10.9a1.9 1.9 0 0 1 1.78-1.89a17 17 0 0 1 3.79.33A10.7 10.7 0 0 1 11 5.233" />
                        </svg>

                    </div>
                    <div>
                        <p className="ad-stat-value">{stats.activeAssignments}</p>
                        <p className="ad-stat-label">Active Assignments</p>
                    </div>
                </div>
            </div>

            {/* Bottom cards */}
            <div className="ad-cards-row">
                <div className="ad-card">
                    <div className="ad-card-header ad-card-header--navy">
                        <div className="ad-card-header-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                <path d="M0 0h20v20H0z" fill="none" />
                                <path fill="#ffffff" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                            </svg>
                        </div>
                        <div>
                            <p className="ad-card-title">Recent Assignments</p>
                            <p className="ad-card-subtitle">Manage your assignments</p>
                        </div>
                    </div>

                    <div className="ad-card-body">
                        <div className="ad-list-item">
                            <span className="ad-list-icon ad-list-icon--navy">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                    <path d="M0 0h20v20H0z" fill="none" />
                                    <path fill="#112562" d="M5 17h13v2H5c-1.66 0-3-1.34-3-3V4c0-1.66 1.34-3 3-3h13v14H5c-.55 0-1 .45-1 1s.45 1 1 1m2-3.5v-11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v11c0 .28.22.5.5.5s.5-.22.5-.5" />
                                </svg>
                            </span>
                            <div className="ad-list-text">
                                <p className="ad-list-title">{recentAssignment.subject}</p>
                                <p className="ad-list-meta">
                                    {recentAssignment.classLabel}. To be submitted {recentAssignment.due}
                                </p>
                            </div>
                            <span className="ad-badge ad-badge--active">{recentAssignment.status}</span>
                        </div>

                        <Link to="/portal/admin/assignments" className="ad-view-all">
                            View all
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="ad-card">
                    <div className="ad-card-header ad-card-header--red">
                        <div className="ad-card-header-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg>
                        </div>
                        <div>
                            <p className="ad-card-title">CBT Tests/Exams</p>
                            <p className="ad-card-subtitle">Schedule a Computer-based Tests/Exams</p>
                        </div>
                    </div>

                    <div className="ad-card-body">
                        <div className="ad-list-item">
                            <span className="ad-list-icon ad-list-icon--red">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                            </span>
                            <div className="ad-list-text">
                                <p className="ad-list-title">{recentCbt.subject}</p>
                                <p className="ad-list-meta">{recentCbt.type}</p>
                            </div>
                            <span className="ad-badge ad-badge--expired">{recentCbt.status}</span>
                        </div>

                        <Link to="/portal/admin/cbt" className="ad-view-all">
                            View all
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}