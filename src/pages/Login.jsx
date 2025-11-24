import React, { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");

  try {
    const res = await API.post("/api/auth/login", {
      email,
      password,
    });

    const token = res.data.token;
    console.log("TOKEN:", token); // Debug log

    if (!token) {
      setErr("No token received");
      return;
    }

    localStorage.setItem("token", token);
    nav("/dashboard", { replace: true });

  } catch (error) {
    setErr("Invalid email or password");
  }
};



  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title mb-3 text-center">Login</h3>
          {err && <div className="alert alert-danger py-2">{err}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100">Login</button>
          </form>

          <p className="text-center text-muted mt-3 mb-0">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
