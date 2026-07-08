import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./1Login.css";
import logo from "../../assets/logo2.png";


const BASE_URL = "https://heroesschool-management-backend.vercel.app";

export default function StudentLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ studentId: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: form.studentId,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed. Check your credentials.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/portal/student/dashboard");
        } catch (err) {
            setError(err.message || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
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
                        <label className="sl-label" htmlFor="studentId">Student Id</label>
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
                        <label className="sl-label" htmlFor="password">Password</label>
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

                    {error && <p className="sl-error">{error}</p>}

                    <button type="submit" className="sl-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="sl-forgot">Forgot Password? Contact School Admin</p>
            </div>

            <div className="sl-bottom-links">
                <Link to="/portal/staff/login" className="sl-bottom-link">Login as Staff</Link>
                <Link to="/portal/admin/login" className="sl-bottom-link">Login as Admin</Link>
            </div>
        </div>
    );
}