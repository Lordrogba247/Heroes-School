import { useState } from "react";
import "./10Profile.css";

// Mock staff data — backend dev go replace with real auth user
const staffInfo = {
    name: "Aderibigbe Oluwatosin",
    role: "Class Teacher JSS 2",
    staffId: "HCS/2025/01348",
    sex: "Male",
};

export default function StaffProfile() {
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleChangePassword = () => {
        const { oldPassword, newPassword, confirmPassword } = passwords;

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        // Backend dev go hit change password endpoint here
        setSuccess("Password changed successfully!");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    return (
        <div className="sp-page">
            <h1 className="sp-title">Profile</h1>
            <p className="sp-sub">Your name, Staff ID, sex, role, and password</p>

            {/* Important notice */}
            <div className="sp-alert">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="sp-alert-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <p className="sp-alert-text">
                    <span className="sp-alert-bold">Important:</span> You can change your password only
                </p>
            </div>

            {/* Staff info */}
            <div className="sp-info">
                <div className="sp-info-row">
                    <span className="sp-info-label">Name:</span>
                    <span className="sp-info-value">{staffInfo.name}</span>
                </div>
                <div className="sp-info-row">
                    <span className="sp-info-label">Role:</span>
                    <span className="sp-info-value">{staffInfo.role}</span>
                </div>
                <div className="sp-info-row">
                    <span className="sp-info-label">Staff ID:</span>
                    <span className="sp-info-value">{staffInfo.staffId}</span>
                </div>
                <div className="sp-info-row">
                    <span className="sp-info-label">Sex:</span>
                    <span className="sp-info-value">{staffInfo.sex}</span>
                </div>
            </div>

            <hr className="sp-divider" />

            {/* Password change form */}
            <div className="sp-pw-form">
                <div className="sp-pw-grid">
                    <div className="sp-field">
                        <label className="sp-label">Old Password</label>
                        <input
                            name="oldPassword"
                            type="password"
                            className="sp-input"
                            placeholder="Type here..."
                            value={passwords.oldPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="sp-field">
                        <label className="sp-label">New Password</label>
                        <input
                            name="newPassword"
                            type="password"
                            className="sp-input"
                            placeholder="Type here..."
                            value={passwords.newPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="sp-field">
                        <label className="sp-label">Confirm New Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="sp-input"
                            placeholder="Type here..."
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="sp-btn-wrap">
                        {error && <p className="sp-error">{error}</p>}
                        {success && <p className="sp-success">{success}</p>}
                        <button className="sp-change-btn" onClick={handleChangePassword}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="currentColor" d="M12.63 2c5.53 0 10.01 4.5 10.01 10s-4.48 10-10.01 10c-3.51 0-6.58-1.82-8.37-4.57l1.58-1.25C7.25 18.47 9.76 20 12.64 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8C8.56 4 5.2 7.06 4.71 11h2.76l-3.74 3.73L0 11h2.69c.5-5.05 4.76-9 9.94-9m2.96 8.24c.5.01.91.41.91.92v4.61c0 .5-.41.92-.92.92h-5.53c-.51 0-.92-.42-.92-.92v-4.61c0-.51.41-.91.91-.92V9.23c0-1.53 1.25-2.77 2.77-2.77c1.53 0 2.78 1.24 2.78 2.77zm-2.78-2.38c-.75 0-1.37.61-1.37 1.37v1.01h2.75V9.23c0-.76-.62-1.37-1.38-1.37" />
                            </svg>
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}