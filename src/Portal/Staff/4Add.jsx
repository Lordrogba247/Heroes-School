import { useState, useEffect } from "react";
import "./4Add.css";

const emptyForm = { surname: "", otherNames: "", sex: "" };

/**
 * Add/Edit Student modal.
 *
 * Props:
 * - isOpen: boolean — whether the modal is visible
 * - onClose: () => void — called when the modal should close (✕ click or overlay click)
 * - onSubmit: (formData) => void — called with { surname, otherNames, sex } on submit
 * - assignedClass: string — the teacher's locked class, e.g. "JSS 2"
 * - editingStudent: object | null — if provided, pre-fills the form for editing.
 *     Expected shape: { name: string, sex: "M" | "F" }
 */
export default function AddStudentModal({
    isOpen,
    onClose,
    onSubmit,
    assignedClass,
    editingStudent = null,
}) {
    const [form, setForm] = useState(emptyForm);

    // Pre-fill form when opening in edit mode, reset when opening in add mode
    useEffect(() => {
        if (!isOpen) return;

        if (editingStudent) {
            const [surname, ...rest] = editingStudent.name.split(" ");
            setForm({
                surname: surname || "",
                otherNames: rest.join(" "),
                sex: editingStudent.sex === "M" ? "Male" : editingStudent.sex === "F" ? "Female" : "",
            });
        } else {
            setForm(emptyForm);
        }
    }, [isOpen, editingStudent]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const isEditing = Boolean(editingStudent);

    return (
        <div className="ads-modal-overlay" onClick={onClose}>
            <div className="ads-modal" onClick={(e) => e.stopPropagation()}>
                <button className="ads-modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>

                <h2 className="ads-modal-title">Students</h2>
                <p className="ads-modal-sub">
                    Fill the information below to update your students' list
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="ads-form-grid">
                        <div className="ads-field">
                            <label className="ads-label" htmlFor="surname">Surname</label>
                            <input
                                id="surname"
                                type="text"
                                className="ads-input"
                                placeholder="Type here..."
                                value={form.surname}
                                onChange={(e) => handleChange("surname", e.target.value)}
                                required
                            />
                        </div>

                        <div className="ads-field">
                            <label className="ads-label" htmlFor="otherNames">Other Names</label>
                            <input
                                id="otherNames"
                                type="text"
                                className="ads-input"
                                placeholder="Type here..."
                                value={form.otherNames}
                                onChange={(e) => handleChange("otherNames", e.target.value)}
                                required
                            />
                        </div>

                        <div className="ads-field">
                            <label className="ads-label" htmlFor="sex">Sex</label>
                            <select
                                id="sex"
                                className="ads-input ads-select"
                                value={form.sex}
                                onChange={(e) => handleChange("sex", e.target.value)}
                                required
                            >
                                <option value="" disabled>Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="ads-field">
                            <label className="ads-label" htmlFor="class">Class</label>
                            <input
                                id="class"
                                type="text"
                                className="ads-input ads-input--locked"
                                value={assignedClass}
                                disabled
                                readOnly
                            />
                        </div>
                    </div>

                    <button type="submit" className="ads-submit-btn">
                        {isEditing ? "Save Changes" : "Add Student"}
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}