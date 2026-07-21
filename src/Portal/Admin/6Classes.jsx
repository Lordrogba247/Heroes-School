import { useEffect, useState } from "react";
import "./6Classes.css";
import { useMeta } from "../../hooks/useMeta";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";
const CLASSES_ENDPOINT = `${BASE_URL}/api/admin/classes`;
const STAFF_ENDPOINT = `${BASE_URL}/api/admin/staff`;

// Mock classes data — fallback/demo data shown if API fails or returns empty
const initialClasses = [
    { id: "c1", name: "Primary 1", code: "P1", classTeacher: null, studentCount: 22, capacity: 40 },
    { id: "c2", name: "Primary 2", code: "P2", classTeacher: null, studentCount: 19, capacity: 40 },
    { id: "c3", name: "Primary 3", code: "P3", classTeacher: null, studentCount: 25, capacity: 40 },
    { id: "c4", name: "Primary 4", code: "P4", classTeacher: null, studentCount: 20, capacity: 40 },
    { id: "c5", name: "Primary 5", code: "P5", classTeacher: null, studentCount: 18, capacity: 40 },
    { id: "c6", name: "JSS 1", code: "JSS1", classTeacher: null, studentCount: 30, capacity: 40 },
    { id: "c7", name: "JSS 2", code: "JSS2", classTeacher: null, studentCount: 28, capacity: 40 },
    { id: "c8", name: "JSS 3", code: "JSS3", classTeacher: null, studentCount: 26, capacity: 40 },
    { id: "c9", name: "SSS 1", code: "SSS1", classTeacher: null, studentCount: 24, capacity: 40 },
    { id: "c10", name: "SSS 2", code: "SSS2", classTeacher: null, studentCount: 21, capacity: 40 },
    { id: "c11", name: "SSS 3", code: "SSS3", classTeacher: null, studentCount: 19, capacity: 40 },
];

const emptyForm = { name: "", code: "", level: "", grade: "", academicSession: "" };

export default function AdminClasses() {
    const { sessions: metaSessions, refetch: refetchMeta } = useMeta();

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const token = localStorage.getItem("token");

    async function loadClassData() {
        setLoading(true);
        setError(null);

        try {
            const headers = { "Authorization": `Bearer ${token}` };

            const [classesRes, staffRes] = await Promise.all([
                fetch(CLASSES_ENDPOINT, { method: "GET", headers }),
                fetch(STAFF_ENDPOINT, { method: "GET", headers }),
            ]);

            if (!classesRes.ok || !staffRes.ok) {
                throw new Error("Failed to load class data");
            }

            const classesResult = await classesRes.json();
            const staffResult = await staffRes.json();

            const fetchedClasses = classesResult.data || [];
            const staffList = staffResult.data || [];

            if (fetchedClasses.length === 0) {
                setClasses(initialClasses);
                return;
            }

            const nameByStaffId = {};
            staffList.forEach((s) => {
                nameByStaffId[s.staffId] = s.name;
            });

            const merged = fetchedClasses.map((c) => ({
                ...c,
                teacherName: c.classTeacher ? (nameByStaffId[c.classTeacher] || c.classTeacher) : "Not assigned",
            }));

            setClasses(merged);
        } catch (err) {
            setError(err.message);
            setClasses(initialClasses);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadClassData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openAddModal = () => {
        setForm({
            ...emptyForm,
            academicSession: metaSessions[0] ? (typeof metaSessions[0] === "string" ? metaSessions[0] : metaSessions[0].name) : "",
        });
        setFormError("");
        setShowAddModal(true);
    };

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddClass = async () => {
        if (!form.name.trim() || !form.code.trim() || !form.level.trim() || !form.grade || !form.academicSession) {
            setFormError("Please fill in all fields.");
            return;
        }

        setSubmitting(true);
        setFormError("");
        try {
            const res = await fetch(CLASSES_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    code: form.code.trim(),
                    level: form.level.trim(),
                    grade: Number(form.grade),
                    academicSession: form.academicSession,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create class.");

            setShowAddModal(false);
            await refetchMeta(); // so other pages' class dropdowns pick up the new class too
            loadClassData(); // refresh this page's table
        } catch (err) {
            setFormError(err.message || "Failed to create class.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="adc-page">
            <h1 className="adc-title">Classes</h1>
            <p className="adc-subtitle">Find below the available classes at your school</p>

            {error && <p className="adc-error">Couldn't load class data: {error}</p>}

            <div className="adc-table-wrap">
                <table className="adc-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Teacher</th>
                            <th>No in class</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3}>Loading…</td></tr>
                        ) : (
                            classes.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.teacherName || (c.classTeacher ? c.classTeacher : "Not assigned")}</td>
                                    <td>{c.studentCount ?? c.count ?? 0}{c.capacity ? ` / ${c.capacity}` : ""}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <button className="adc-add-btn" onClick={openAddModal}>
                Add Class
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"
                    />
                </svg>
            </button>

            {/* Add Class modal */}
            {showAddModal && (
                <div className="adc-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="adc-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="adc-modal-title">Add Class</h3>

                        <div className="adc-modal-form">
                            <label className="adc-modal-label">
                                Class name
                                <input
                                    type="text"
                                    className="adc-modal-input"
                                    placeholder="e.g. JSS 1"
                                    value={form.name}
                                    onChange={(e) => handleFormChange("name", e.target.value)}
                                />
                            </label>

                            <label className="adc-modal-label">
                                Code
                                <input
                                    type="text"
                                    className="adc-modal-input"
                                    placeholder="e.g. JSS1"
                                    value={form.code}
                                    onChange={(e) => handleFormChange("code", e.target.value)}
                                />
                            </label>

                            <label className="adc-modal-label">
                                Level
                                <input
                                    type="text"
                                    className="adc-modal-input"
                                    placeholder="e.g. primary, jss, sss"
                                    value={form.level}
                                    onChange={(e) => handleFormChange("level", e.target.value)}
                                />
                            </label>

                            <label className="adc-modal-label">
                                Grade
                                <input
                                    type="number"
                                    className="adc-modal-input"
                                    placeholder="e.g. 1"
                                    value={form.grade}
                                    onChange={(e) => handleFormChange("grade", e.target.value)}
                                />
                            </label>

                            <label className="adc-modal-label">
                                Academic session
                                <select
                                    className="adc-modal-input"
                                    value={form.academicSession}
                                    onChange={(e) => handleFormChange("academicSession", e.target.value)}
                                >
                                    {metaSessions.map((s) => {
                                        const name = typeof s === "string" ? s : s.name;
                                        return <option key={name} value={name}>{name}</option>;
                                    })}
                                </select>
                            </label>
                        </div>

                        {formError && <p className="adc-error">{formError}</p>}

                        <div className="adc-modal-actions">
                            <button
                                className="adc-modal-btn adc-modal-btn--cancel"
                                onClick={() => setShowAddModal(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="adc-modal-btn adc-modal-btn--submit"
                                onClick={handleAddClass}
                                disabled={submitting}
                            >
                                {submitting ? "Adding..." : "Add Class"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}