import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-3 mb-4">
      <span className="navbar-brand fw-bold">📝 OnlineFormBuilder</span>

      <div>
        <Link to="/dashboard" className="btn btn-light me-2">
          Dashboard
        </Link>
        <Link to="/create" className="btn btn-dark me-2">
          + Create
        </Link>
        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

