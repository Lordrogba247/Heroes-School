import { useState, useRef } from "react";
import "./3Assignment.css";

// Mock data — backend dev go replace with real API
const assignmentsData = [
    {
        id: 1,
        subject: "Chemistry",
        type: "Research Assignment",
        due: "July 12, 2026",
        instruction: "Research in not less than 10 paragraphs with images the fractional distillation of Crude Oil",
        submitted: false,
    },
];

function AssignmentCard({ assignment }) {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selected]);
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Backend dev go handle file upload + submission here
        console.log("Submitting assignment", assignment.id, "with files:", files);
    };

    return (
        <div className="sa-card">
            {/* Card header */}
            <div className="sa-card-header">
                <p className="sa-card-subject">{assignment.subject}</p>
                <p className="sa-card-type">{assignment.type}</p>
            </div>

            {/* Card body */}
            <div className="sa-card-body">
                <p className="sa-due">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="none" stroke="#112562" stroke-dasharray="66" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z">
                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
                        </path>
                        <path fill="#112562" d="M5 5h14v0h-14Z">
                            <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" to="M5 5h14v3h-14Z" />
                        </path>
                        <g fill="none" stroke="#112562" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
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

                    Due: {assignment.due}
                </p>

                <p className="sa-instruction-label">Instruction</p>
                <p className="sa-instruction-text">{assignment.instruction}</p>

                {/* Attachment upload */}
                <div className="sa-attach-section">
                    <div className="sa-attach-row">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="18"
                            height="18"
                            className="sa-attach-icon"
                            onClick={() => fileInputRef.current.click()}
                            title="Click to attach file"
                        >
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V6H9v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S6 2.79 6 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1z" />
                        </svg>
                        <span className="sa-attach-label">
                            {files.length} attachment{files.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    {/* File list */}
                    {files.length > 0 && (
                        <ul className="sa-file-list">
                            {files.map((file, i) => (
                                <li key={i} className="sa-file-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                    <span className="sa-file-name">{file.name}</span>
                                    <button
                                        className="sa-file-remove"
                                        onClick={() => removeFile(i)}
                                        aria-label="Remove file"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="sa-card-footer">
                    <button className="sa-submit-btn" onClick={handleSubmit}>
                        Mark as Submitted
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function StudentAssignment() {
    return (
        <div className="sa-page">
            <h1 className="sa-title">Assignments</h1>
            <p className="sa-sub">View and submit assignments</p>

            <div className="sa-list">
                {assignmentsData.map((a) => (
                    <AssignmentCard key={a.id} assignment={a} />
                ))}
            </div>
        </div>
    );
}