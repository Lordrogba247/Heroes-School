import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStaffMeta } from "../../hooks/useStaffMeta";
import "./8Result2.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

const subjectOptions = [
    "Mathematics", "English Language", "Basic Science", "Basic Technology",
    "Civic Education", "Social Studies", "Computer Studies/ICT", "Agricultural Science",
    "Christian Religious Studies", "Islamic Religious Studies", "Yoruba", "Hausa", "Igbo",
    "French", "Home Economics", "Physical and Health Education", "Creative and Cultural Arts",
    "Verbal Reasoning", "Quantitative Reasoning", "Business Studies", "Physics", "Chemistry",
    "Biology", "Further Mathematics", "Geography", "Government", "Economics",
    "Literature-in-English", "History", "Financial Account", "Commerce", "Marketing",
    "Technical Drawing", "Food and Nutrition",
];

const fallbackSessions = ["2024/2025", "2025/2026", "2026/2027"];
const fallbackTerms = ["First Term", "Second Term", "Third Term"];
const TERM_OPTIONS = [
    { value: "first", label: "First Term" },
    { value: "second", label: "Second Term" },
    { value: "third", label: "Third Term" },
];

function getGrade(total) {
    if (total >= 75) return { grade: "A1", remark: "Excellent" };
    if (total >= 70) return { grade: "B2", remark: "V.Good" };
    if (total >= 65) return { grade: "B3", remark: "Good" };
    if (total >= 60) return { grade: "C4", remark: "Credit" };
    if (total >= 55) return { grade: "C5", remark: "Credit" };
    if (total >= 50) return { grade: "C6", remark: "Credit" };
    if (total >= 45) return { grade: "D7", remark: "Pass" };
    if (total >= 40) return { grade: "E8", remark: "Pass" };
    return { grade: "F9", remark: "Fail" };
}

// Kindergarten/Nursery/Primary → no Grade column. Secondary (JSS/SSS) keeps it.
function isLowerSchoolClass(studentClass) {
    if (!studentClass) return false;
    const cls = String(studentClass).toLowerCase();
    return cls.includes("primary") || cls.includes("nursery") || cls.includes("kindergarten") || cls.includes("creche") || /(^|[^a-z])kg([^a-z]|$)/.test(cls);
}

const emptyRowInput = { subject: "", ca1: "", ca2: "", exam: "" };

export default function StaffResultEntry() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const { sessions: metaSessions, terms: metaTerms, subjects: metaSubjects } = useStaffMeta();

    const [student, setStudent] = useState(null);
    const [loadingStudent, setLoadingStudent] = useState(true);
    const [loadError, setLoadError] = useState("");

    const sessionOptions = Array.from(
        new Set([...metaSessions.map((s) => s.name), ...fallbackSessions])
    ).sort();
    // metaTerms come back as labels ("First Term"...), TERM_OPTIONS values are ("first"...).
    // Normalize so the select value always matches what the backend expects.
    const labelToValue = Object.fromEntries(TERM_OPTIONS.map((t) => [t.label, t.value]));
    const valueToLabel = Object.fromEntries(TERM_OPTIONS.map((t) => [t.value, t.label]));
    const termOptions =
        metaTerms.length > 0
            ? metaTerms.map((t) => labelToValue[t] || valueToLabel[t] || t)
            : fallbackTerms.map((t) => labelToValue[t] || t);

    const [session, setSession] = useState("");
    const [term, setTerm] = useState(TERM_OPTIONS[2].value);
    const [rowInput, setRowInput] = useState(emptyRowInput);
    const [results, setResults] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentInput, setCommentInput] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [commentError, setCommentError] = useState("");
    const [commentNotice, setCommentNotice] = useState("");
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    // Locked ONLY when the backend refuses a save with 403 (published).
    // Saving must never lock the page — re-save = upsert overwrite until publish.
    const [resultLocked, setResultLocked] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitNotice, setSubmitNotice] = useState("");
    const [loadingSaved, setLoadingSaved] = useState(true);
    const commentInFlight = useRef(false);
    const submitInFlight = useRef(false);
    const savedLoadSeq = useRef(0);

    // De-duplicate a comment thread by id, falling back to normalised text.
    // This hides historical double-saves (same text posted twice) and also
    // collapses an optimistic tmp entry against the server copy whose
    // createdAt may differ by milliseconds.
    const dedupeComments = (list) => {
        if (!Array.isArray(list)) return [];
        const seenIds = new Set();
        const seenTexts = new Set();
        const out = [];
        for (const c of list) {
            const id = c?._id || c?.id;
            const normText = String(c?.text ?? "").trim().toLowerCase();
            if (id && seenIds.has(String(id))) continue;
            if (id) seenIds.add(String(id));
            // Only collapse on text when there is actual text; keep distinct texts.
            if (normText && seenTexts.has(normText)) continue;
            if (normText) seenTexts.add(normText);
            out.push(c);
        }
        return out;
    };

    // Per backend contract §4: UI may only know subject codes — map to canonical
    // meta names (case-insensitive) before POST /api/staff/results, otherwise
    // backend auto-creates a new subject under the resolved session and the row
    // "disappears" from the selector you are looking at.
    const canonicalSubjectName = (raw) => {
        const s = String(raw ?? "").trim();
        if (!s) return s;
        const toName = (n) =>
            typeof n === "string" ? n : (n?.name ?? n?.subject ?? n?.title ?? n?.value ?? "");
        const pool = [
            ...(Array.isArray(metaSubjects) ? metaSubjects.map(toName).filter(Boolean) : []),
            ...subjectOptions,
        ];
        const map = new Map(pool.map((n) => [String(n).toUpperCase(), n]));
        return map.get(s.toUpperCase()) || s;
    };

    const clampScore = (v, max) => {
        const n = Number(v);
        if (!Number.isFinite(n)) return 0;
        return Math.min(Math.max(Math.round(n), 0), max);
    };

    // Backend uses term *labels* ("Third Term") for publish/list elsewhere, so the
    // comment GET/POST must also send the label — never the raw value ("third").
    // Otherwise comments save/load under the wrong term and look like "not adding".
    const termLabel =
        (TERM_OPTIONS.find((t) => t.value === term) || {}).label || term;

    // Default to the current session once meta loads (falls back to 2026/2027),
    // so the newest session is always pre-selected and visible.
    useEffect(() => {
        if (sessionOptions.length > 0 && !session) {
            const current = metaSessions.find((s) => s.isCurrent);
            if (current) {
                setSession(current.name);
            } else if (sessionOptions.includes("2026/2027")) {
                setSession("2026/2027");
            } else {
                setSession(sessionOptions[sessionOptions.length - 1]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionOptions.length]);

    // Load the student's info directly by ID (no more full-list fetch + filter)
    useEffect(() => {
        fetch(`${BASE_URL}/api/staff/students/${encodeURIComponent(studentId)}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Student not found.");
                return res.json();
            })
            .then((data) => setStudent(data.data || null))
            .catch(() => setLoadError("Failed to load student details."))
            .finally(() => setLoadingStudent(false));
    }, [studentId]);

    // ---- Saved-result loader helpers (revisit must show inputted rows) ----
    const normSavedTerm = (t) => {
        const v = String(t ?? "").toLowerCase();
        if (v.includes("first")) return "first";
        if (v.includes("second")) return "second";
        if (v.includes("third")) return "third";
        return v;
    };

    const extractSavedResult = (json, wantSession, wantTermCanon) => {
        if (!json) return null;
        const root = json.data ?? json.result ?? json;
        const candidates = Array.isArray(root) ? root : [root];
        let fallback = null;
        for (const c of candidates) {
            const subj = c?.subjects || c?.scores || c?.items || null;
            if (!Array.isArray(subj) || subj.length === 0) continue;
            if (!fallback) fallback = c;
            const cSess = c?.session?.name || c?.session || c?.academicSession || null;
            const cTerm = c?.term || c?.termLabel || null;
            const sessOk = !wantSession || !cSess || String(cSess) === String(wantSession);
            const termOk = !wantTermCanon || !cTerm || normSavedTerm(cTerm) === wantTermCanon;
            if (sessOk && termOk) return c;
        }
        return fallback;
    };

    const normaliseSavedSubjects = (raw) => {
        const list = raw?.subjects || raw?.scores || raw?.items || [];
        if (!Array.isArray(list)) return [];
        return list
            .map((s, i) => {
                const name = s?.subject ?? s?.name ?? s?.title ?? "";
                if (!name) return null;
                const ca1 = Number(s?.ca1 ?? s?.ca1Score ?? 0) || 0;
                const ca2 = Number(s?.ca2 ?? s?.ca2Score ?? 0) || 0;
                const exam = Number(s?.exam ?? s?.examScore ?? 0) || 0;
                const total = Number(s?.total ?? s?.percent ?? s?.thirdTotal ?? (ca1 + ca2 + exam)) || 0;
                const g = s?.grade && s?.remark ? { grade: s.grade, remark: s.remark } : getGrade(total);
                return {
                    id: s?._id || s?.id || `saved-${i}`,
                    subject: canonicalSubjectName(name),
                    ca1, ca2, exam, total,
                    grade: g.grade, remark: g.remark,
                };
            })
            .filter(Boolean);
    };

    // Load the already-saved subject rows for this student + session + term so a
    // revisit shows the inputted result instead of an empty table + comment only.
    useEffect(() => {
        if (!studentId || !session) {
            setLoadingSaved(false);
            return;
        }
        const seq = ++savedLoadSeq.current;
        setLoadingSaved(true);
        const wantTerm = normSavedTerm(termLabel || term);
        const urls = [
            `${BASE_URL}/api/staff/results/${encodeURIComponent(studentId)}?${new URLSearchParams({ session, term: termLabel })}`,
            `${BASE_URL}/api/staff/results/${encodeURIComponent(studentId)}?${new URLSearchParams({ session, term: wantTerm })}`,
            `${BASE_URL}/api/staff/results/${encodeURIComponent(studentId)}`,
            `${BASE_URL}/api/staff/results?${new URLSearchParams({ studentId, session, term: termLabel })}`,
            `${BASE_URL}/api/staff/results?${new URLSearchParams({ studentId, session, term: wantTerm })}`,
        ];
        (async () => {
            let found = null;
            for (const u of urls) {
                try {
                    const res = await fetch(u, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${token}` },
                    });
                    if (!res.ok) continue;
                    const json = await res.json().catch(() => null);
                    const hit = extractSavedResult(json, session, wantTerm);
                    if (hit) { found = hit; break; }
                } catch { /* try next candidate */ }
            }
            if (savedLoadSeq.current !== seq) return;
            // Fallback: a local snapshot saved right after submit, so a revisit
            // restores the inputted rows + comment even if no staff GET endpoint
            // exists for this backend deployment (admin view works because it has
            // GET /api/admin/results/:studentId).
            if (!found) {
                try {
                    const raw = localStorage.getItem(`staff-result:${studentId}:${session}:${wantTerm}`);
                    if (raw) found = JSON.parse(raw);
                } catch { /* ignore corrupt snapshot */ }
            }
            if (found) {
                const rows = normaliseSavedSubjects(found);
                const isFinal = Boolean(
                    found?.isFinal ?? found?.published ?? false
                );
                if (rows.length > 0) {
                    setResults((prev) => (prev.length === 0 || isFinal ? rows : prev));
                }
                // Only publish/final locks the page — a saved (submitted) draft
                // stays editable so mistakes can be corrected before publishing.
                if (isFinal) setResultLocked(true);
                const single = found?.comment;
                const singleText = typeof single === "string" ? single : single?.text;
                if (singleText) {
                    setComments((prev) => {
                        if (prev.length > 0) return prev;
                        return dedupeComments([{
                            _id: single?._id || single?.id || "result-comment",
                            text: singleText,
                            author: single?.author,
                            createdAt: single?.createdAt || found?.updatedAt || new Date().toISOString(),
                        }]);
                    });
                }
            }
            setLoadingSaved(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId, session, term]);

    // Load existing comments for this student + session + term (label form).
    // Accepts overrides so callers can reload from the backend's `attachedTo`
    // fallback location instead of the stale selector that was just posted to.
    // Every set path runs through dedupeComments so a historical double-save
    // (same text posted twice) renders once instead of "double comments".
    const loadComments = (overrideSession, overrideTermLabel) => {
        const effSession = overrideSession || session;
        const effTermLabel = overrideTermLabel || termLabel;
        if (!effSession) {
            setLoadingComments(false);
            return;
        }
        setLoadingComments(true);
        const params = new URLSearchParams({ session: effSession, term: effTermLabel });
        fetch(`${BASE_URL}/api/staff/results/${encodeURIComponent(studentId)}/comments?${params}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load comments.");
                return res.json();
            })
            .then((data) => {
                const list = data.data || data.comments || [];
                if (Array.isArray(list) && list.length > 0) {
                    // Replace with the server thread (de-duplicated). Any optimistic
                    // tmp entry for the same text collapses via dedupeComments, and
                    // lagging server copies no longer stack into "double comments".
                    setComments(dedupeComments(list));
                    return;
                }
                // Filtered list came back empty (e.g. selector is stale while the
                // backend attached the comment to the latest result). Best-effort:
                // pull the thread unfiltered so the saved comment still shows,
                // then de-duplicate so the fallback can't stack on the selector list.
                fetch(`${BASE_URL}/api/staff/results/${encodeURIComponent(studentId)}/comments`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` },
                })
                    .then((r) => (r.ok ? r.json() : null))
                    .then((j) => {
                        if (!j) return;
                        const all = j.data || j.comments || [];
                        if (Array.isArray(all) && all.length > 0) setComments(dedupeComments(all));
                    })
                    .catch(() => { /* keep existing optimistic list */ });
            })
            .catch(() => { /* keep existing optimistic list */ })
            .finally(() => setLoadingComments(false));
    };

    useEffect(() => {
        loadComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId, session, term]);

    const handleRowChange = (field, value) => {
        setRowInput((prev) => ({ ...prev, [field]: value }));
    };

    const resetRowInput = () => {
        setRowInput(emptyRowInput);
        setEditingId(null);
    };

    const handleAddResult = () => {
        const { subject, ca1, ca2, exam } = rowInput;
        if (!subject || ca1 === "" || ca2 === "" || exam === "") return;

        // Contract §1: CA 0–20, exam 0–60, total ≤ 100 — clamp + reject client-side
        // so runValidators never fails the whole save.
        const ca1Num = clampScore(ca1, 20);
        const ca2Num = clampScore(ca2, 20);
        const examNum = clampScore(exam, 60);
        if (ca1Num + ca2Num + examNum > 100) {
            return;
        }
        const canonSubject = canonicalSubjectName(subject);
        const total = ca1Num + ca2Num + examNum;
        const { grade, remark } = getGrade(total);

        if (editingId) {
            setResults((prev) =>
                prev.map((r) =>
                    r.id === editingId
                        ? { ...r, subject: canonSubject, ca1: ca1Num, ca2: ca2Num, exam: examNum, total, grade, remark }
                        : r
                )
            );
        } else {
            // Avoid silent duplicate rows for the same canonical subject.
            setResults((prev) => {
                const idx = prev.findIndex(
                    (r) => String(r.subject).toUpperCase() === canonSubject.toUpperCase()
                );
                if (idx >= 0) {
                    const next = [...prev];
                    next[idx] = { ...next[idx], subject: canonSubject, ca1: ca1Num, ca2: ca2Num, exam: examNum, total, grade, remark };
                    return next;
                }
                return [
                    ...prev,
                    { id: Date.now(), subject: canonSubject, ca1: ca1Num, ca2: ca2Num, exam: examNum, total, grade, remark },
                ];
            });
        }

        resetRowInput();
    };

    const handleEditRow = (row) => {
        setEditingId(row.id);
        setRowInput({
            subject: row.subject,
            ca1: String(row.ca1),
            ca2: String(row.ca2),
            exam: String(row.exam),
        });
    };

    const handleDeleteRow = (id) => {
        setResults((prev) => prev.filter((r) => r.id !== id));
        if (editingId === id) resetRowInput();
    };

    const handleAddComment = async () => {
        if (!commentInput.trim()) return;
        // Guard against double-click / double-invoke (React StrictMode + fast
        // clicks): state updates are async so `postingComment` alone still lets
        // two POSTs through on one click → comment saved twice.
        if (postingComment || commentInFlight.current) return;
        commentInFlight.current = true;

        setPostingComment(true);
        setCommentError("");
        setCommentNotice("");
        try {
            // New backend contract (7489249): session + term are REQUIRED —
            // always send the selector values, never a fallback.
            if (!session || !term) {
                throw new Error("Please select a session/term.");
            }
            const res = await fetch(`${BASE_URL}/api/staff/results/${encodeURIComponent(studentId)}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ text: commentInput.trim(), session, term: termLabel }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                // Commenting on a published result is refused with 403 + lock the page.
                if (res.status === 403) setResultLocked(true);
                throw new Error(data.message || "Failed to add comment.");
            }

            // Prefer the saved comment returned by the backend (handles shapes like
            // { data: {...} }, { comment: {...} }, or the raw comment object).
            const saved = data?.data?.comment ?? data?.data ?? data?.comment ?? data;
            if (saved && (saved.text || saved._id || saved.id)) {
                const savedItem = {
                    _id: saved._id || saved.id || `tmp-${Date.now()}`,
                    text: saved.text ?? commentInput.trim(),
                    author: saved.author,
                    createdAt: saved.createdAt || new Date().toISOString(),
                };
                // Merge + de-duplicate so an optimistic entry collapses against the
                // server copy even when createdAt differs by milliseconds, and a
                // historical double-save (same text twice) renders once.
                setComments((prev) => dedupeComments([...prev, savedItem]));
            }

            // Backend resolves session/term exactly (no silent fallback).
            // `savedFor`/`attachedTo` echo where it landed — reload from there.
            const attached = data?.attachedTo ?? data?.data?.attachedTo ?? data?.savedFor ?? null;
            const attachedSession = attached?.session || null;
            const attachedTermLabel = attached?.term || null;
            let reloadSession = session;
            let reloadTermLabel = termLabel;
            if (attachedSession && attachedSession !== session) {
                reloadSession = attachedSession;
                setSession(attachedSession);
            }
            if (attachedTermLabel && attachedTermLabel !== termLabel) {
                reloadTermLabel = attachedTermLabel;
                const mapped = labelToValue[attachedTermLabel];
                if (mapped) setTerm(mapped);
                else {
                    const norm = String(attachedTermLabel).toLowerCase();
                    if (norm.includes("first")) setTerm("first");
                    else if (norm.includes("second")) setTerm("second");
                    else if (norm.includes("third")) setTerm("third");
                }
            }

            setCommentInput("");
            setCommentError("");
            // Reload from server (source of truth) so the list shows the saved comment
            // with its real id/author/timestamp — and retry once if the list lags.
            loadComments(reloadSession, reloadTermLabel);
            setTimeout(() => loadComments(reloadSession, reloadTermLabel), 1500);
        } catch (err) {
            setCommentError(err.message || "Failed to add comment. Please try again.");
        } finally {
            commentInFlight.current = false;
            setPostingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!commentId || deletingCommentId || postingComment) return;
        // New backend contract (7489249): session + term are REQUIRED —
        // always send the selector values, never a fallback.
        if (!session || !term) {
            setCommentError("Please select a session/term.");
            return;
        }
        setDeletingCommentId(commentId);
        setCommentError("");
        try {
            const params = new URLSearchParams({ session, term: termLabel });
            const res = await fetch(
                `${BASE_URL}/api/staff/results/${encodeURIComponent(studentId)}/comments/${encodeURIComponent(commentId)}?${params}`,
                {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` },
                }
            );
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                // Deleting on a published result is refused with 403 + lock the page.
                if (res.status === 403) setResultLocked(true);
                throw new Error(data.message || "Failed to delete comment.");
            }
            setComments((prev) => prev.filter((c) => String(c._id || c.id) !== String(commentId)));
        } catch (err) {
            setCommentError(err.message || "Failed to delete comment. Please try again.");
        } finally {
            setDeletingCommentId(null);
        }
    };

    const livePreview = (() => {
        const { ca1, ca2, exam } = rowInput;
        if (ca1 === "" || ca2 === "" || exam === "") return null;
        const total = Number(ca1) + Number(ca2) + Number(exam);
        return { total, ...getGrade(total) };
    })();

    // Grade column is hidden for Kindergarten/Nursery/Primary.
    // Student object here uses `class` / `studentClass` (see StudentsList shape).
    const showGrade = !isLowerSchoolClass(
        student?.class || student?.studentClass || student?.student_class || ""
    );

    const handleSubmitResult = async () => {
        if (results.length === 0 || !student) return;
        // Same double-click guard as comments — one click must equal one save.
        if (submitting || submitInFlight.current) return;
        // New backend contract (7489249): session + term are REQUIRED and
        // resolved exactly — no silent redirect to "current session". Always
        // send the selector values.
        if (!session || !term) {
            setSubmitError("Please select a session/term.");
            return;
        }
        submitInFlight.current = true;

        setSubmitting(true);
        setSubmitError("");
        setSubmitNotice("");
        setResultLocked(false);
        try {
            // Term must be lowercase canonical (first/second/third).
            const HEX24 = /^[0-9a-fA-F]{24}$/;
            const sessionName = String(session || "").trim();
            const safeSession = sessionName && !HEX24.test(sessionName) ? sessionName : undefined;
            if (!safeSession) {
                throw new Error("Please select a session/term.");
            }
            const canonTerm = String(term || "").trim().toLowerCase();
            const termValue = ["first", "second", "third"].includes(canonTerm)
                ? canonTerm
                : (canonTerm.includes("first") ? "first" : canonTerm.includes("second") ? "second" : canonTerm.includes("third") ? "third" : "third");

            // Contract §1 + §4: canonical subject names, CA ≤ 20 / exam ≤ 60,
            // total ≤ 100, non-empty subjects array. Filter (don't throw) so one
            // bad row can't nuke the whole save.
            const normalizedSubjects = results
                .map((r) => ({
                    subject: canonicalSubjectName(r.subject),
                    ca1: clampScore(r.ca1, 20),
                    ca2: clampScore(r.ca2, 20),
                    exam: clampScore(r.exam, 60),
                }))
                .filter((s) => s.subject && (s.ca1 + s.ca2 + s.exam) <= 100);
            if (normalizedSubjects.length === 0) {
                throw new Error("At least one subject is required.");
            }

            // Contract §1: studentId accepts _id / registration id / populated
            // object — prefer the route param (real Mongo _id) with fallbacks.
            const studentRef = studentId || student.id || student._id || student.studentId;
            // Contract §1: class is optional but include it when known so the row
            // lands where the teacher expects instead of a fallback class.
            const studentClass =
                student?.classLabel?.name || student?.classLabel ||
                student?.class?.name || student?.class ||
                student?.studentClass || student?.student_class || undefined;
            const payload = {
                studentId: studentRef,
                ...(safeSession ? { session: safeSession } : {}),
                term: termValue,
                subjects: normalizedSubjects,
                ...(studentClass ? { class: studentClass } : {}),
            };

            const res = await fetch(`${BASE_URL}/api/staff/results`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                // Backend commit 7489249: locked rows come back 403 + exact message
                // "Result for <Subject> is already published and can no longer be edited".
                // Surface it as-is AND mark the page locked so the inputs stay
                // read-only exactly like the published state.
                if (res.status === 403) {
                    setResultLocked(true);
                }
                throw new Error(
                    data.message ||
                    (res.status === 403
                        ? "This result is already published and can no longer be edited."
                        : "Failed to save result.")
                );
            }

            // New contract: save is an upsert that stays EDITABLE until publish.
            // Do NOT lock the page here — only a 403 (published) locks it.

            // Contract §3: NEVER trust the stale selector — read savedFor and
            // move the dropdowns to wherever the backend actually stored the row.
            // Otherwise the save "looks missing" (it went to current session).
            const savedFor = data?.savedFor ?? data?.data?.savedFor ?? null;
            const savedSession = savedFor?.session || null;
            const savedTermRaw = savedFor?.term || null;
            if (savedSession && savedSession !== session) setSession(savedSession);
            if (savedTermRaw) {
                const norm = String(savedTermRaw).toLowerCase();
                const canon = ["first", "second", "third"].includes(norm)
                    ? norm
                    : (norm.includes("first") ? "first" : norm.includes("second") ? "second" : norm.includes("third") ? "third" : null);
                if (canon && canon !== term) setTerm(canon);
            }
            if (savedSession || savedTermRaw) {
                const tLbl = valueToLabel[
                    ["first", "second", "third"].includes(String(savedTermRaw || "").toLowerCase())
                        ? String(savedTermRaw).toLowerCase()
                        : termValue
                ] || savedTermRaw || valueToLabel[termValue];
                setSubmitNotice(`Saved to ${savedSession || safeSession || session} · ${tLbl}.`);
            }

            // FIX (double-comment bug): DO NOT re-POST the comment thread here.
            // The old code sent `comment` inside the result payload AND then
            // POSTed the same text to /comments → one click saved it twice.
            // Just refresh the thread view from where the backend stored it.
            const savedTermLabel = savedTermRaw
                ? (valueToLabel[String(savedTermRaw).toLowerCase()] || String(savedTermRaw))
                : undefined;
            loadComments(savedSession || undefined, savedTermLabel);

            setSubmitNotice(`Result saved for ${savedSession || safeSession || session} · ${savedTermLabel || valueToLabel[termValue] || termLabel}. You can still edit it until it is published.`);

            // Snapshot what was just saved so a revisit restores the inputted
            // rows + latest comment even if the backend exposes no staff GET.
            // NOTE: this snapshot does NOT lock the page — the save stays
            // editable (re-save = upsert overwrite) until publish (403).
            try {
                const snapTerm = normSavedTerm(savedTermRaw || termValue || termLabel || term);
                const snapSession = savedSession || safeSession || session;
                const latestComment = [...comments]
                    .map((c) => c?.text)
                    .filter((t) => String(t ?? "").trim())
                    .pop();
                localStorage.setItem(
                    `staff-result:${studentId}:${snapSession}:${snapTerm}`,
                    JSON.stringify({
                        session: snapSession,
                        term: snapTerm,
                        subjects: results.map((r) => ({
                            subject: r.subject,
                            ca1: r.ca1,
                            ca2: r.ca2,
                            exam: r.exam,
                            total: r.total,
                            grade: r.grade,
                            remark: r.remark,
                        })),
                        comment: latestComment || null,
                        isSubmitted: false,
                        updatedAt: new Date().toISOString(),
                    })
                );
            } catch { /* snapshot is best-effort only */ }

            // Stay unlocked: the teacher can correct mistakes by editing + saving again.
        } catch (err) {
            setSubmitError(err.message || "Failed to save result. Please try again.");
        } finally {
            submitInFlight.current = false;
            setSubmitting(false);
        }
    };

    if (loadingStudent) return <div className="sre-page"><p>Loading student...</p></div>;
    if (loadError || !student) return <div className="sre-page"><p className="sre-error">{loadError || "Student not found."}</p></div>;

    return (
        <div className="sre-page">
            <button className="sre-back-btn" onClick={() => navigate("/portal/staff/results")}>
                ← Back to Students
            </button>

            <h1 className="sre-title">{student.name}</h1>
            <p className="sre-sub">
                {student.studentId} &nbsp; {student.sex} &nbsp; {student.classLabel?.name || student.classLabel || student.class?.name || student.class}
            </p>

            {/* Session / Term */}
            <div className="sre-top-row">
                <select
                    className="sre-select"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    disabled={resultLocked}
                >
                    {sessionOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="sre-select"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    disabled={resultLocked}
                >
                    {termOptions.map((value) => (
                        <option key={value} value={value}>{valueToLabel[value] || value}</option>
                    ))}
                </select>
            </div>

            {/* Row input table — stays editable after saving; locks only on publish */}
            {!resultLocked && (
                <div className="sre-input-table-wrap">
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
                                        onChange={(e) => handleRowChange("subject", e.target.value)}
                                    >
                                        <option value="" disabled>Subject</option>
                                        {subjectOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        className="sre-cell-input"
                                        value={rowInput.ca1}
                                        onChange={(e) => handleRowChange("ca1", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        className="sre-cell-input"
                                        value={rowInput.ca2}
                                        onChange={(e) => handleRowChange("ca2", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="60"
                                        className="sre-cell-input"
                                        value={rowInput.exam}
                                        onChange={(e) => handleRowChange("exam", e.target.value)}
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

            {/* Results table */}
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
                                {!submitted && <th>Action</th>}
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                                                        <path d="M0 0h1024v1024H0z" fill="none" />
                                                        <path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9m67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32" />
                                                    </svg>

                                                </button>
                                                <button
                                                    className="sre-icon-btn sre-icon-btn--delete"
                                                    onClick={() => handleDeleteRow(r.id)}
                                                    aria-label="Delete result"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                        <path d="M0 0h24v24H0z" fill="none" />
                                                        <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z" />
                                                    </svg>

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

            {/* Comment thread — this text is attached to the result via Submit below.
                If the backend ignores the `comment` field on submit, still post it
                to the comment thread so it is never lost. */}
            <p className="sre-comment-hint" style={{ fontSize: 12, color: "#666", margin: "0 0 8px" }}>
                This comment will be saved on the student's result when you press Save Result.
            </p>
            <div className="sre-comment-row">
                <input
                    type="text"
                    className="sre-comment-input"
                    placeholder="Add a comment on this student's performance..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    disabled={postingComment}
                />
                <button
                    className="sre-comment-btn"
                    onClick={handleAddComment}
                    disabled={postingComment || !commentInput.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20m3-9h-2V9a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2" />
                    </svg>
                    {postingComment ? "Posting..." : "Add Comment"}
                </button>
            </div>

            {commentError && <p className="sre-error">{commentError}</p>}
            {commentNotice && (
                <p className="sre-comment-hint" style={{ fontSize: 12, color: "#8a6d1b", margin: "0 0 8px" }}>
                    {commentNotice}
                </p>
            )}

            {/* Comments list */}
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
                                    {c.author ? `${c.author.firstName} ${c.author.lastName}` : ""}
                                    {c.author && c.createdAt ? " — " : ""}
                                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* No fixed "cannot edit" warning here: results stay editable after
                saving and lock only when published (backend commit 7489249).
                The publish warning lives on the Publish button (list page). */}

            {submitError && <p className="sre-error">{submitError}</p>}
            {submitNotice && (
                <p className="sre-comment-hint" style={{ fontSize: 12, color: "#1a6b2e", margin: "0 0 8px" }}>
                    {submitNotice}
                </p>
            )}

            {/* Save — stays enabled so mistakes can be corrected (re-save = upsert overwrite).
                Locks only when the result is published (resultLocked from 403). */}
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