import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./1Login.css";
import logo from "../../assets/logo2.png";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ adminId: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Backend dev go hook real auth here
        navigate("/portal/admin/dashboard");
    };

    return (
        <div className="sl-page">
            <Link to="/" className="sl-brand">
                <img src={logo} alt="Heroes College logo" className="sl-brand-logo" />
                <div className="sl-brand-titles">
                    <span className="sl-brand-name">Heroes College</span>
                    <span className="sl-brand-sub">&amp; Primary School</span>
                </div>
            </Link>

            <div className="sl-card">
                <div className="sl-icon sl-icon--red">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="#e62e2d" d="M12 14v8H4a8 8 0 0 1 8-8m0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m9 4h1v5h-8v-5h1v-1a3 3 0 1 1 6 0zm-2 0v-1a1 1 0 1 0-2 0v1z" />
                    </svg>
                </div>

                <h1 className="sl-title sl-title--red">Admin Portal</h1>
                <p className="sl-subtitle">
                    Login with your User Id and Password to access your dashboard
                </p>

                <form className="sl-form" onSubmit={handleLogin}>
                    <div className="sl-field">
                        <label className="sl-label sl-label--red" htmlFor="adminId">
                            Admin Id
                        </label>
                        <input
                            id="adminId"
                            name="adminId"
                            type="text"
                            className="sl-input sl-input--red"
                            placeholder="Type here..."
                            value={form.adminId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="sl-field">
                        <label className="sl-label sl-label--red" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="sl-input sl-input--red"
                            placeholder="Type here..."
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="sl-btn sl-btn--red">
                        Login
                    </button>
                </form>

                <p className="sl-forgot">Forgot Password? Contact School Admin</p>
            </div>

            <div className="sl-bottom-links">
                <Link to="/portal/student/login" className="sl-bottom-link">Login as Student</Link>
                <Link to="/portal/staff/login" className="sl-bottom-link">Login as Staff</Link>
            </div>
        </div>
    );
}