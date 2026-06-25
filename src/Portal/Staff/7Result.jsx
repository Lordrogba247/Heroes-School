import { useNavigate } from "react-router-dom";
import "./7Result.css";

// Mock students data — backend dev go replace with real API (students in this class)
const studentsData = [
    { id: 1, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01324", sex: "M" },
    { id: 2, name: "Adekoya Bimbo Mosunmola", studentId: "HC/2025/01325", sex: "F" },
    { id: 3, name: "Temidire Audu Ali", studentId: "HC/2025/01326", sex: "M" },
    { id: 4, name: "Richard Judith emenembo", studentId: "HC/2025/01314", sex: "F" },
    { id: 5, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01354", sex: "M" },
    { id: 6, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01327", sex: "M" },
    { id: 7, name: "Abdulafeez Simbiat Rukayat", studentId: "HC/2025/01424", sex: "F" },
    { id: 8, name: "Luke Demilade Mary", studentId: "HC/2025/01320", sex: "F" },
    { id: 9, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01328", sex: "M" },
    { id: 10, name: "Tijesunimi Irede Dorcas", studentId: "HC/2025/01340", sex: "F" },
];

export default function StaffResultsList() {
    const navigate = useNavigate();

    const handleUpload = (student) => {
        navigate(`/portal/staff/results/${student.id}`);
    };

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
                            {studentsData.map((s) => (
                                <tr key={s.id}>
                                    <td className="srl-name">{s.name}</td>
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
        </div>
    );
}