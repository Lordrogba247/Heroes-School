import { useNavigate } from "react-router-dom";
import "./Portal.css";

const portals = [
    {
        id: "student",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm-7 8.6V16l7 3.87L19 16v-4.4L12 15.87 5 11.6z" />
            </svg>
        ),
        title: "Student Portal",
        description: "Access assignments, results and CBT exams",
        btnLabel: "Enter as Student",
        accent: "navy",
        path: "/portal/student/login",
    },
    {
        id: "staff",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                <path d="M0 0h512v512H0z" fill="none" />
                <path fill="#9a7ecb" d="M120.998 40.998v37.943C136.22 89.471 146 109.278 146 131.001c0 13.71-3.901 26.65-10.598 36.985c3.465 1.35 7.106 2.85 10.15 4.172l122.352-22.783l5.918 54.842l-111.748 23.219c-.862 16.261-2.45 32.262-5.289 51.566h336.217V40.998zM96 88.998c-16.595 0-32.002 17.747-32.002 42.004S79.405 173.004 96 173.004s32.002-17.745 32.002-42.002S112.595 88.998 96 88.998m156.096 81.629l-108.592 20.22c-14.24-5.602-4.956-3.035-21.469-8.517c-7.476 5.469-16.33 8.672-26.035 8.672c-8.6 0-16.53-2.523-23.428-6.9c-8.59 3.564-17.655 8.09-25.736 12.654c-12.992 7.338-23.722 13.211-27.838 16.033v130.213h20.004V232h17.996v263.002h30.004V326h17.996v169.002h26.004v-171.84l.154-.824c9.514-50.64 12.588-77.384 13.461-109.656l109.56-22.766zm-98.153 126.375c-.952 5.682-1.991 11.64-3.146 17.996H478v-17.996zM208 344.998c-16.595 0-32.002 17.747-32.002 42.004c0 18.198 8.67 32.73 20.01 38.855c3.599-1.662 7.482-2.706 11.68-2.851c4.633-.16 8.98.767 13.052 2.42c10.968-6.352 19.262-20.63 19.262-38.424c0-24.257-15.407-42.004-32.002-42.004m112 0c-16.595 0-32.002 17.747-32.002 42.004c0 18.198 8.67 32.73 20.01 38.855c3.599-1.662 7.482-2.706 11.68-2.851c4.633-.16 8.98.767 13.052 2.42c10.968-6.352 19.262-20.63 19.262-38.424c0-24.257-15.407-42.004-32.002-42.004m112 0c-16.595 0-32.002 17.747-32.002 42.004c0 18.198 8.67 32.73 20.01 38.855c3.599-1.662 7.482-2.706 11.68-2.851c4.633-.16 8.98.767 13.052 2.42c10.968-6.352 19.262-20.63 19.262-38.424c0-24.257-15.407-42.004-32.002-42.004m-223.688 95.996c-3.844.133-8.907 2.93-14.3 8.785s-10.696 14.25-15.125 22.76c-4.226 8.12-7.609 16.16-10.06 22.463h85.339c-3.04-6.436-7.138-14.549-12.133-22.711c-5.298-8.658-11.511-17.138-17.668-22.957s-11.8-8.487-16.053-8.34m112 0c-3.844.133-8.907 2.93-14.3 8.785s-10.696 14.25-15.125 22.76c-4.226 8.12-7.609 16.16-10.06 22.463h85.339c-3.04-6.436-7.138-14.549-12.133-22.711c-5.298-8.658-11.511-17.138-17.668-22.957s-11.8-8.487-16.052-8.34zm112 0c-3.844.133-8.907 2.93-14.3 8.785s-10.696 14.25-15.125 22.76c-4.226 8.12-7.609 16.16-10.06 22.463h85.339c-3.04-6.436-7.138-14.549-12.133-22.711c-5.298-8.658-11.511-17.138-17.668-22.957s-11.8-8.487-16.052-8.34z" />
            </svg>

        ),
        title: "Staff Portal",
        description: "Manage Classes, enter scores, view CBT results",
        btnLabel: "Enter as Staff",
        accent: "purple",
        path: "/portal/staff/login",
    },
    {
        id: "admin",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="#e62e2d" d="M12 14v8H4a8 8 0 0 1 8-8m0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m9 4h1v5h-8v-5h1v-1a3 3 0 1 1 6 0zm-2 0v-1a1 1 0 1 0-2 0v1z" />
            </svg>


        ),
        title: "Admin Portal",
        description: "Full system control and User management",
        btnLabel: "Enter as Admin",
        accent: "red",
        path: "/portal/admin/login",
    },
];

export default function Portal() {
    const navigate = useNavigate();

    return (
        <div className="portal-overlay">
            <div className="portal-modal">
                {/* Close button */}
                <button
                    className="portal-close"
                    onClick={() => navigate("/")}
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="portal-header">
                    <div className="portal-door-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path fill="#112562" d="M12 19h2V6l6.394 2.74a1 1 0 0 1 .606.92V19h2v2H1v-2h2V5.65a1 1 0 0 1 .594-.914l7.703-3.423a.5.5 0 0 1 .703.456z" />
                        </svg>

                    </div>
                    <h1 className="portal-title">Select your Portal</h1>
                    <p className="portal-subtitle">
                        Choose the portal that matches your role
                    </p>
                </div>

                {/* Cards */}
                <div className="portal-cards">
                    {portals.map((p) => (
                        <div className={`portal-card portal-card--${p.accent}`} key={p.id}>
                            <div className={`portal-card-icon portal-card-icon--${p.accent}`}>
                                {p.icon}
                            </div>
                            <h2 className={`portal-card-title portal-card-title--${p.accent}`}>
                                {p.title}
                            </h2>
                            <p className="portal-card-desc">{p.description}</p>
                            <button
                                className={`portal-card-btn portal-card-btn--${p.accent}`}
                                onClick={() => navigate(p.path)}
                            >
                                {p.btnLabel}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}