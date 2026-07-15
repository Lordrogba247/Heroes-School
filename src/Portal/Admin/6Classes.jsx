import { useEffect, useState } from "react";
import "./6Classes.css";

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

export default function AdminClasses() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadClassData() {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
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

                // Both endpoints return { success, data: [...] } — data is a plain array
                const fetchedClasses = classesResult.data || [];
                const staffList = staffResult.data || [];

                if (fetchedClasses.length === 0) {
                    if (isMounted) setClasses(initialClasses);
                    return;
                }

                // classTeacher on the class record is a staffId string (or null) — look up
                // the matching staff member's name to display instead of the raw ID.
                const nameByStaffId = {};
                staffList.forEach((s) => {
                    nameByStaffId[s.staffId] = s.name;
                });

                const merged = fetchedClasses.map((c) => ({
                    ...c,
                    teacherName: c.classTeacher ? (nameByStaffId[c.classTeacher] || c.classTeacher) : "Not assigned",
                }));

                if (isMounted) setClasses(merged);
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setClasses(initialClasses);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadClassData();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleAddClass = () => {
        // No POST /api/admin/classes (or similar) endpoint exists in the current API
        // documentation. This needs a real endpoint from the backend before it can be wired.
        alert("Adding new classes isn't supported by the backend yet — check with the backend dev.");
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

            <button className="adc-add-btn" onClick={handleAddClass}>
                Add Class
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"
                    />
                </svg>
            </button>
        </div>
    );
}