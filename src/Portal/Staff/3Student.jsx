import { useState } from "react";
import "./3Student.css";
import AddStudentModal from "./4Add";

// Mock staff data — backend dev go replace with real user from auth context
const staff = {
    assignedClass: "JSS 2",
};

// Mock students data — backend dev go replace with real API (students in this class)
const initialStudents = [
    { id: 1, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01324", sex: "M", class: "JSS2" },
    { id: 2, name: "Adekoya Bimbo Mosunmola", studentId: "HC/2025/01325", sex: "F", class: "JSS2" },
    { id: 3, name: "Temidire Audu Ali", studentId: "HC/2025/01326", sex: "M", class: "JSS2" },
    { id: 4, name: "Richard Judith emenembo", studentId: "HC/2025/01314", sex: "F", class: "JSS2" },
    { id: 5, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01354", sex: "M", class: "JSS2" },
    { id: 6, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01327", sex: "M", class: "JSS2" },
    { id: 7, name: "Abdulafeez Simbiat Rukayat", studentId: "HC/2025/01424", sex: "F", class: "JSS2" },
    { id: 8, name: "Luke Demilade Mary", studentId: "HC/2025/01320", sex: "F", class: "JSS2" },
    { id: 9, name: "Adedayo Tofunmi Moses", studentId: "HC/2025/01328", sex: "M", class: "JSS2" },
    { id: 10, name: "Tijesunimi Irede Dorcas", studentId: "HC/2025/01340", sex: "F", class: "JSS2" },
];

export default function StudentsList() {
    const [students, setStudents] = useState(initialStudents);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null); // null = adding, otherwise the student object being edited
    const [deleteTarget, setDeleteTarget] = useState(null); // student object pending delete confirmation

    const openAddModal = () => {
        setEditingStudent(null);
        setModalOpen(true);
    };

    const openEditModal = (student) => {
        setEditingStudent(student);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingStudent(null);
    };

    const handleModalSubmit = (form) => {
        const fullName = `${form.surname} ${form.otherNames}`.trim();
        const sexLetter = form.sex === "Male" ? "M" : form.sex === "Female" ? "F" : "";

        if (editingStudent) {
            // Backend dev go PUT/PATCH update here
            setStudents((prev) =>
                prev.map((s) =>
                    s.id === editingStudent.id
                        ? { ...s, name: fullName, sex: sexLetter }
                        : s
                )
            );
        } else {
            // Backend dev go POST new student here, then use the real returned studentId
            const newStudent = {
                id: Date.now(),
                name: fullName,
                studentId: "Pending",
                sex: sexLetter,
                class: staff.assignedClass.replace(" ", ""),
            };
            setStudents((prev) => [...prev, newStudent]);
        }

        closeModal();
    };

    const confirmDelete = () => {
        // Backend dev go DELETE request here
        setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="stu-page">
            <h1 className="stu-title">Students</h1>
            <p className="stu-sub">Find below the list of students in your class</p>

            <div className="stu-table-card">
                <div className="stu-table-wrap">
                    <table className="stu-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Student ID</th>
                                <th>Sex</th>
                                <th>Class</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.id}>
                                    <td className="stu-name">{s.name}</td>
                                    <td>{s.studentId}</td>
                                    <td>{s.sex}</td>
                                    <td>{s.class}</td>
                                    <td>
                                        <div className="stu-actions">
                                            <span>Edit details</span>
                                            <button
                                                className="stu-icon-btn stu-icon-btn--edit"
                                                onClick={() => openEditModal(s)}
                                                aria-label="Edit student"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                    <path d="M0 0h24v24H0z" fill="none" />
                                                    <path fill="currentColor" d="M3.548 20.938h16.9a.5.5 0 0 0 0-1h-16.9a.5.5 0 0 0 0 1M9.71 17.18a2.6 2.6 0 0 0 1.12-.65l9.54-9.54a1.75 1.75 0 0 0 0-2.47l-.94-.93a1.79 1.79 0 0 0-2.47 0l-9.54 9.53a2.5 2.5 0 0 0-.64 1.12L6.04 17a.74.74 0 0 0 .19.72a.77.77 0 0 0 .53.22Zm.41-1.36a1.47 1.47 0 0 1-.67.39l-.97.26l-1-1l.26-.97a1.5 1.5 0 0 1 .39-.67l.38-.37l1.99 1.99Zm1.09-1.08l-1.99-1.99l6.73-6.73l1.99 1.99Zm8.45-8.45L18.65 7.3l-1.99-1.99l1.01-1.02a.75.75 0 0 1 1.06 0l.93.94a.754.754 0 0 1 0 1.06" />
                                                </svg>

                                            </button>
                                            <button
                                                className="stu-icon-btn stu-icon-btn--delete"
                                                onClick={() => setDeleteTarget(s)}
                                                aria-label="Delete student"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                    <path d="M0 0h24v24H0z" fill="none" />
                                                    <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z" />
                                                </svg>

                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="stu-add-row">
                <button className="stu-add-btn" onClick={openAddModal}>
                    Add Student
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </button>
            </div>

            {/* Add / Edit modal — separate component */}
            <AddStudentModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                assignedClass={staff.assignedClass}
                editingStudent={editingStudent}
            />

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="stu-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="stu-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="stu-confirm-title">Remove Student?</h3>
                        <p className="stu-confirm-text">
                            Are you sure you want to remove <strong>{deleteTarget.name}</strong> from your class list? This cannot be undone.
                        </p>
                        <div className="stu-confirm-actions">
                            <button
                                className="stu-confirm-btn stu-confirm-btn--cancel"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="stu-confirm-btn stu-confirm-btn--delete"
                                onClick={confirmDelete}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}