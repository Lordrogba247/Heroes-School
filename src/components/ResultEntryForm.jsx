import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useResultEntry, formatCommentAuthor } from "../hooks/useResultEntry.jsx";

// Shared result-entry form — identical logic + markup for staff and admin.
// `portal` is "staff" or "admin": picks the API prefix and the back link.
export default function ResultEntryForm({ portal = "staff" }) {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const incoming = location.state || {};
    const isAdmin = portal === "admin";

    const e = useResultEntry(portal, studentId, incoming);
    const {
        student, loadingStudent, loadError,
        studentClassLabel, subjectOptions, usingFallbackSubjects,
        classSubjectsLoading,
        session, setSession, term, setTerm,
        sessionOptions, termOptions, termValueToLabel,
        rowInput, setRowInput, results,
        editingId, livePreview, showGrade,
        comments, loadingComments, commentInput, setCommentInput,
        postingComment, commentError, commentNotice, deletingCommentId,
        resultLocked, submitting, submitError, submitNotice, loadingSaved,
        handleAddComment, handleDeleteComment,
        handleAddResult, handleEditRow, handleDeleteRow, handleSubmitResult,
    } = e;

    if (loadingStudent) return <div className="sre-page"><p>Loading student...</p></div>;
    if (loadError || !student) return <div className="sre-page"><p className="sre-error">{loadError || "Student not found."}</p></div>;

    return (
        <div className="sre-page">
            <button className="sre-back-btn" onClick={() => navigate(isAdmin ? "/portal/admin/results" : "/portal/staff/results")}>
                {isAdmin ? "← Back to Results" : "← Back to Students"}
            </button>

            <h1 className="sre-title">{student.name}</h1>
            <p className="sre-sub">
                {student.studentId} &nbsp; {student.sex} &nbsp; {student.classLabel?.name || student.classLabel || student.class?.name || student.class}
            </p>

            <div className="sre-top-row">
                <select
                    className="sre-select"
                    value={session}
                    onChange={(ev) => setSession(ev.target.value)}
                    disabled={resultLocked}
                >
                    <option value="">Select Session</option>
                    {sessionOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="sre-select"
                    value={term}
                    onChange={(ev) => setTerm(ev.target.value)}
                    disabled={resultLocked}
                >
                    <option value="">Select Term</option>
                    {termOptions.map((value) => (
                        <option key={value} value={value}>{termValueToLabel[value] || value}</option>
                    ))}
                </select>
            </div>

            {!resultLocked && (
                <div className="sre-input-table-wrap">
                    <p className="sre-comment-hint" style={{ fontSize: 12, color: "#555", margin: "0 0 8px" }}>
                        {classSubjectsLoading
                            ? `Loading subjects offered in ${studentClassLabel || "this class"}…`
                            : usingFallbackSubjects
                                ? "Subject list unavailable — showing general fallback."
                                : `Showing ${subjectOptions.length} subject${subjectOptions.length === 1 ? "" : "s"} offered in ${studentClassLabel || "this class"}.`}
                    </p>
                    <table className="sre-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>1st C.A (20)</th>
                                <th>2nd C.A (20)</th>
                                <th>Exam (60)</th>
                                <th>Total (100)</th>
                                {showGrade && <th>Grade</th>}
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select
                                        className="sre-cell-select"
                                        value={rowInput.subject}
                                        onChange={(ev) => setRowInput("subject", ev.target.value)}
                                    >
                                        <option value="" disabled>Subject</option>
                                        {subjectOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number" min="0" max="20"
                                        className="sre-cell-input"
                                        value={rowInput.ca1}
                                        onChange={(ev) => setRowInput("ca1", ev.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number" min="0" max="20"
                                        className="sre-cell-input"
                                        value={rowInput.ca2}
                                        onChange={(ev) => setRowInput("ca2", ev.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number" min="0" max="60"
                                        className="sre-cell-input"
                                        value={rowInput.exam}
                                        onChange={(ev) => setRowInput("exam", ev.target.value)}
                                    />
                                </td>
                                <td className="sre-readonly-cell">{livePreview ? livePreview.total : "—"}</td>
                                {showGrade && <td className="sre-readonly-cell">{livePreview ? livePreview.grade : "—"}</td>}
                                <td className="sre-readonly-cell">{livePreview ? livePreview.remark : "—"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <button className="sre-add-result-btn" onClick={handleAddResult}>
                        {editingId ? "Save Result" : "Add result"}
                    </button>
                </div>
            )}

            {loadingSaved && results.length === 0 && (
                <p className="sre-comment-hint" style={{ fontSize: 12, margin: "0 0 8px" }}>
                    Loading saved result…
                </p>
            )}
            {results.length > 0 && (
                <div className="sre-results-table-wrap">
                    <table className="sre-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>1st C.A (20)</th>
                                <th>2nd C.A (20)</th>
                                <th>Exam (60)</th>
                                <th>Total (100)</th>
                                {showGrade && <th>Grade</th>}
                                <th>Remark</th>
                                {!resultLocked && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr key={r.id}>
                                    <td className="sre-subject-cell">{r.subject}</td>
                                    <td>{r.ca1}</td>
                                    <td>{r.ca2}</td>
                                    <td>{r.exam}</td>
                                    <td>{r.total}</td>
                                    {showGrade && <td>{r.grade}</td>}
                                    <td>{r.remark}</td>
                                    {!resultLocked && (
                                        <td>
                                            <div className="sre-row-actions">
                                                <button
                                                    className="sre-icon-btn sre-icon-btn--edit"
                                                    onClick={() => handleEditRow(r)}
                                                    aria-label="Edit result"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="sre-icon-btn sre-icon-btn--delete"
                                                    onClick={() => handleDeleteRow(r.id)}
                                                    aria-label="Delete result"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="sre-comment-hint" style={{ fontSize: 12, color: "#666", margin: "0 0 8px" }}>
                Comments are saved immediately and don&apos;t need the Save Result button.
            </p>
            <div className="sre-comment-row">
                <input
                    type="text"
                    className="sre-comment-input"
                    placeholder="Add a comment on this student's performance..."
                    value={commentInput}
                    onChange={(ev) => setCommentInput(ev.target.value)}
                    disabled={postingComment}
                />
                <button
                    className="sre-comment-btn"
                    onClick={handleAddComment}
                    disabled={postingComment || !commentInput.trim()}
                >
                    {postingComment ? "Posting..." : "Add Comment"}
                </button>
            </div>

            {commentError && <p className="sre-error">{commentError}</p>}
            {commentNotice && (
                <p className="sre-comment-hint" style={{ fontSize: 12, color: "#8a6d1b", margin: "0 0 8px" }}>
                    {commentNotice}
                </p>
            )}

            {!loadingComments && comments.length > 0 && (
                <div className="sre-comments-list">
                    {comments.map((c, i) => {
                        const cid = c._id || c.id;
                        return (
                            <div key={cid || i} className="sre-comment-item">
                                <div className="sre-comment-item-top">
                                    <p className="sre-comment-text">{c.text}</p>
                                    {cid && (
                                        <button
                                            className="sre-comment-delete-btn"
                                            onClick={() => handleDeleteComment(cid)}
                                            disabled={deletingCommentId === cid}
                                            title="Delete this comment"
                                            aria-label="Delete comment"
                                        >
                                            {deletingCommentId === cid ? "Deleting..." : "Delete"}
                                        </button>
                                    )}
                                </div>
                                <span className="sre-comment-time">
                                    {formatCommentAuthor(c.author)}
                                    {formatCommentAuthor(c.author) && c.createdAt ? " — " : ""}
                                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {submitError && <p className="sre-error">{submitError}</p>}
            {submitNotice && (
                <p className="sre-comment-hint" style={{ fontSize: 12, color: "#1a6b2e", margin: "0 0 8px" }}>
                    {submitNotice}
                </p>
            )}

            <button
                className="sre-submit-btn"
                onClick={handleSubmitResult}
                disabled={resultLocked || submitting || results.length === 0}
            >
                {resultLocked ? "Published — locked" : submitting ? "Saving..." : "Save Result"}
            </button>
        </div>
    );
}