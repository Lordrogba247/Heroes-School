import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./1Login.css";
import logo from "../../assets/logo2.png";

export default function StudentLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ studentId: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Backend dev go hook real auth here
        navigate("/portal/student/dashboard");
    };

    return (
        <div className="sl-page">
            {/* Top-left branding */}
            <Link to="/" className="sl-brand">
                <img src={logo} alt="Heroes College logo" className="sl-brand-logo" />
                <div className="sl-brand-titles">
                    <span className="sl-brand-name">Heroes College</span>
                    <span className="sl-brand-sub">&amp; Primary School</span>
                </div>
            </Link>

            {/* Login card */}
            <div className="sl-card">
                {/* Icon */}
                <div className="sl-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm-7 8.6V16l7 3.87L19 16v-4.4L12 15.87 5 11.6z" />
                    </svg>
                </div>

                <h1 className="sl-title">Student Portal</h1>
                <p className="sl-subtitle">
                    Login with your User Id and Password to access your dashboard
                </p>

                <form className="sl-form" onSubmit={handleLogin}>
                    <div className="sl-field">
                        <label className="sl-label" htmlFor="studentId">
                            Student Id
                        </label>
                        <input
                            id="studentId"
                            name="studentId"
                            type="text"
                            className="sl-input"
                            placeholder="Type here..."
                            value={form.studentId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="sl-field">
                        <label className="sl-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="sl-input"
                            placeholder="Type here..."
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="sl-btn">
                        Login
                    </button>
                </form>

                <p className="sl-forgot">
                    Forgot Password? Contact School Admin
                </p>
            </div>

            {/* Bottom role switcher */}
            <div className="sl-bottom-links">
                <Link to="/portal/staff/login" className="sl-bottom-link">
                    Login as Staff
                </Link>
                <Link to="/portal/admin/login" className="sl-bottom-link">
                    Login as Admin
                </Link>
            </div>
        </div>
    );
}