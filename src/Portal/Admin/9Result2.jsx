import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./9Result2.css";
import schoolLogo from "../../assets/logo2.png";

// Mock student data — backend dev go replace with real API, fetched by studentId
const studentsData = [
    { id: 1, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01324", sex: "M", classLabel: "JSS2" },
    { id: 2, name: "Adekoya Bimbo Mosunmola", studentId: "HC/2025/01325", sex: "F", classLabel: "JSS2" },
    { id: 3, name: "Temidire Audu Ali", studentId: "HC/2025/01326", sex: "M", classLabel: "JSS2" },
    { id: 4, name: "Richard Judith emenembo", studentId: "HC/2025/01314", sex: "F", classLabel: "JSS2" },
    { id: 5, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01354", sex: "M", classLabel: "JSS2" },
    { id: 6, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01327", sex: "M", classLabel: "JSS2" },
    { id: 7, name: "Abdulafeez Simbiat Rukayat", studentId: "HC/2025/01424", sex: "F", classLabel: "JSS2" },
    { id: 8, name: "Luke Demilade Mary", studentId: "HC/2025/01320", sex: "F", classLabel: "JSS2" },
    { id: 9, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01328", sex: "M", classLabel: "JSS2" },
    { id: 10, name: "Tijesunimi Irede Dorcas", studentId: "HC/2025/01340", sex: "F", classLabel: "JSS2" },
];

const schoolInfo = {
    name: "HEROES COLLEGE & PRIMARY SCHOOL",
};

// Mock result data — backend dev go replace with real API, fetched by studentId + session + term
const resultData = {
    subjects: [
        { name: "English Language", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "V.Good" },
        { name: "Mathematics", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "Good" },
        { name: "Chemistry", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "Good" },
        { name: "Physics", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "Good" },
        { name: "Biology", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "Good" },
        { name: "Government", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "Good" },
        { name: "Financial Account", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "Good" },
        { name: "Yoruba", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "B2", remark: "Good" },
        { name: "Literature-in-English", ca1: 15, ca2: 12, exam: 40, total: 67, grade: "A1", remark: "Excellent" },
    ],
    totalScore: 1578,
    percentage: "89.5%",
    comment: "Active in class and hardworking, keep it up, you can do better!",
};

export default function AdminResultView() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const student = studentsData.find((s) => String(s.id) === studentId) || studentsData[0];
    const { session, term, classLabel } = location.state || {
        session: "2025/2026",
        term: "Third Term",
        classLabel: student.classLabel,
    };

    return (
        <div className="adr2-page">
            <button className="adr2-back-btn" onClick={() => navigate("/portal/admin/results")}>
                ← Back to Results
            </button>

            <div className="adr2-card">
                {/* Letterhead */}
                <div className="adr2-letterhead">
                    <img src={schoolLogo} alt="Heroes College" className="adr2-letterhead-logo" />
                    <p className="adr2-letterhead-name">{schoolInfo.name}</p>
                </div>

                {/* Student info */}
                <div className="adr2-info-grid">
                    <p className="adr2-info-item"><span className="adr2-info-label">Name:</span> {student.name}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Student ID:</span> {student.studentId}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Sex:</span> {student.sex}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Session:</span> {session}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Term:</span> {term}</p>
                    <p className="adr2-info-item"><span className="adr2-info-label">Class:</span> {classLabel}</p>
                </div>

                {/* Subjects table */}
                <div className="adr2-table-wrap">
                    <table className="adr2-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>1st C.A (20)</th>
                                <th>2nd C.A (20)</th>
                                <th>Exam (60)</th>
                                <th>Total (100)</th>
                                <th>Grade</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultData.subjects.map((s) => (
                                <tr key={s.name}>
                                    <td className="adr2-subject-name">{s.name}</td>
                                    <td>{s.ca1}</td>
                                    <td>{s.ca2}</td>
                                    <td>{s.exam}</td>
                                    <td>{s.total}</td>
                                    <td>{s.grade}</td>
                                    <td>{s.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary stats */}
                <div className="adr2-stats">
                    <div className="adr2-stat-box">
                        <p className="adr2-stat-value">{resultData.subjects.length}</p>
                        <p className="adr2-stat-label">Subjects</p>
                    </div>
                    <div className="adr2-stat-box">
                        <p className="adr2-stat-value">{resultData.totalScore}</p>
                        <p className="adr2-stat-label">Total Score</p>
                    </div>
                    <div className="adr2-stat-box">
                        <p className="adr2-stat-value">{resultData.percentage}</p>
                        <p className="adr2-stat-label">Percentage</p>
                    </div>
                </div>

                {/* Comment */}
                <div className="adr2-comment-section">
                    <p className="adr2-comment-label">Comment</p>
                    <p className="adr2-comment-text">{resultData.comment}</p>
                </div>
            </div>
        </div>
    );
}