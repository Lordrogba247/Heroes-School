import { useEffect, useState } from "react";
import "./6Classes.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";
const STUDENTS_ENDPOINT = `${BASE_URL}/api/admin/students`;
const STAFF_ENDPOINT = `${BASE_URL}/api/admin/staff`;

// The fixed list of classes the school runs. Order shown = order on screen.
// Consider replacing this with GET /api/admin/meta's `classes[]` if the backend
// exposes it, so this list stays in sync with the school's actual configuration.
const CLASS_LIST = [
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SSS 1",
    "SSS 2",
    "SSS 3",
];

// Pulls the class a given student record belongs to.
// Checks both `class` and `studentClass` since the exact field name returned
// by GET /api/admin/students is unconfirmed (see Staff Portal doc notes).
function mapStudentToClass(student) {
    return student.class || student.studentClass;
}

// Pulls the class a given staff record is assigned to teach, and their name.
// Checks both `name` and split surname/otherNames, since the exact shape
// returned by GET /api/admin/staff is unconfirmed.
function mapStaffToClass(staffMember) {
    const name = staffMember.name || `${staffMember.surname || ""} ${staffMember.otherNames || ""}`.trim();
    return {
        name,
        assignedClass: staffMember.assignedClass,
    };
}

export default function AdminClasses() {
    const [classes, setClasses] = useState(
        // Render the table immediately with empty counts/teachers
        // so the layout doesn't jump once real data arrives.
        CLASS_LIST.map((name) => ({ name, teacher: "—", count: 0 }))
    );
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

                const [studentsRes, staffRes] = await Promise.all([
                    fetch(STUDENTS_ENDPOINT, { method: "GET", headers }),
                    fetch(STAFF_ENDPOINT, { method: "GET", headers }),
                ]);

                if (!studentsRes.ok || !staffRes.ok) {
                    throw new Error("Failed to load class data");
                }

                const studentsData = await studentsRes.json();
                const staffData = await staffRes.json();

                // Handle either a plain array or a { students: [...] } / { staff: [...] } wrapper
                const students = studentsData.students || studentsData || [];
                const staff = staffData.staff || staffData || [];

                // Count students per class
                const countByClass = {};
                students.forEach((student) => {
                    const className = mapStudentToClass(student);
                    if (className) countByClass[className] = (countByClass[className] || 0) + 1;
                });

                // Find the assigned class teacher per class
                const teacherByClass = {};
                staff.forEach((staffMember) => {
                    const { name, assignedClass } = mapStaffToClass(staffMember);
                    if (assignedClass) {
                        teacherByClass[assignedClass] = name;
                    }
                });

                const merged = CLASS_LIST.map((className) => ({
                    name: className,
                    teacher: teacherByClass[className] || "Not assigned",
                    count: countByClass[className] || 0,
                }));

                if (isMounted) setClasses(merged);
            } catch (err) {
                if (isMounted) setError(err.message);
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
                        {classes.map((c) => (
                            <tr key={c.name}>
                                <td>{c.name}</td>
                                <td>{loading ? "Loading…" : c.teacher}</td>
                                <td>{loading ? "—" : c.count}</td>
                            </tr>
                        ))}
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