import React, { useState } from "react";
import { loginUser, registerUser } from "../services/userService";
import { saveAuthSession } from "../services/authStorage";

const authVisual = "/image/upcommingevent.png";

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("attendee");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        await registerUser({ name, email, password, role });
        alert("Registration successful. Please login.");
        setMode("login");
        resetForm();
      } else {
        const authData = await loginUser({ email, password });
        saveAuthSession(authData.user, authData.accessToken, authData.refreshToken);
        onAuthenticated(authData.user);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Authentication failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-shell">
        <aside className="auth-showcase">
          <p className="auth-tag">Event Booking Platform</p>
          <h1>Plan, reserve, and manage every event professionally</h1>
          <p>
            Secure authentication with role based access for customers and admin
            operations.
          </p>
          <img src={authVisual} alt="Upcoming events" />
        </aside>

        <section className="auth-card">
          <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p>{mode === "login" ? "Login to continue" : "Create a new account"}</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="attendee">Attendee</option>
                  <option value="organizer">Organizer</option>
                </select>
              </>
            )}

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <button
            className="mode-btn"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              resetForm();
            }}
          >
            {mode === "login" ? "No account? Register" : "Already have an account? Login"}
          </button>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;
