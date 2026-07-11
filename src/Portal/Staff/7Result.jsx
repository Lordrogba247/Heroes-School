import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./7Result.css";

const BASE_URL = "https://heroesschool-management-backend.vercel.app";

export default function StaffResultsList() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/api/staff/results/students`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load students.");
                return res.json();
            })
            .then((data) => setStudents(data.students || data || []))
            .catch(() => setError("Failed to load students."))
            .finally(() => setLoading(false));
    }, []);

    const handleUpload = (student) => {
        navigate(`/portal/staff/results/${student._id || student.id}`);
    };

    if (loading) return <div className="srl-page"><p>Loading students...</p></div>;
    if (error) return <div className="srl-page"><p className="srl-error">{error}</p></div>;

    return (
        <div className="srl-page">
            <h1 className="srl-title">Results</h1>
            <p className="srl-sub">upload students results and comment on their performances</p>

            <div className="srl-table-card">
                <div className="srl-table-wrap">
                    <table className="srl-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Student ID</th>
                                <th>Sex</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s._id || s.id}>
                                    <td className="srl-name">{s.name || `${s.surname} ${s.otherNames}`}</td>
                                    <td>{s.studentId}</td>
                                    <td>{s.sex}</td>
                                    <td>
                                        <button
                                            className="srl-upload-btn"
                                            onClick={() => handleUpload(s)}
                                        >
                                            Upload Result
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {students.length === 0 && (
                <p className="srl-empty">No students found in your class.</p>
            )}
        </div>
    );
}