import "./4Online.css";

// Mock data — backend dev go replace with real API
const classes = [
    {
        id: 1,
        subject: "Mathematics",
        date: "July 10, 2026",
        class: "JSS 2",
        time: "02:00pm",
        accent: "navy",
        link: "#",
    },
    {
        id: 2,
        subject: "Physics",
        date: "July 12, 2026",
        class: "SSS 2",
        time: "10:00am",
        accent: "red",
        link: "#",
    },
];

export default function StudentOnlineClass() {
    return (
        <div className="oc-page">
            <h1 className="oc-title">Online Classes</h1>
            <p className="oc-sub">Join live session with your teacher</p>

            <div className="oc-list">
                {classes.map((c) => (
                    <div className="oc-card" key={c.id}>
                        {/* Header */}
                        <div className={`oc-card-header oc-card-header--${c.accent}`}>
                            <p className="oc-subject">{c.subject}</p>
                            <div className="oc-meta">
                                <span className="oc-meta-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path fill="none" stroke="#ffffff" stroke-dasharray="66" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z">
                                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
                                        </path>
                                        <path fill="#ffffff" d="M5 5h14v0h-14Z">
                                            <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" to="M5 5h14v3h-14Z" />
                                        </path>
                                        <g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                            <path stroke-dasharray="4" stroke-dashoffset="4" d="M7 4v-2M17 4v-2">
                                                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                            </path>
                                            <path stroke-dasharray="12" stroke-dashoffset="12" d="M7 11h10">
                                                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                            </path>
                                            <path stroke-dasharray="10" stroke-dashoffset="10" d="M7 15h7">
                                                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0" />
                                            </path>
                                        </g>
                                    </svg>

                                    {c.date}
                                </span>
                                <span className="oc-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                                    </svg>
                                    {c.class}
                                </span>
                                <span className="oc-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                                    </svg>
                                    {c.time}
                                </span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="oc-card-body">
                            <a
                                href={c.link}
                                target="_blank"
                                rel="noreferrer"
                                className={`oc-join-btn oc-join-btn--${c.accent}`}
                            >
                                Join Class Now
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}