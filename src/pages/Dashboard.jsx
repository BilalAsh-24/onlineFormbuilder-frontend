import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const res = await API.get("/api/forms/myforms");
        setForms(res.data);
      } catch {
        nav("/login");
      }
    };
    loadForms();
  }, [nav]);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };


  return (
  <>
    <Navbar />
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">My Forms</h3>
        <div className="d-flex gap-2">
          <Link to="/create" className="btn btn-primary">
            + Create Form
          </Link>
          <button className="btn btn-outline-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {forms.length === 0 && (
        <div className="alert alert-info">You don&apos;t have any forms yet.</div>
      )}

      <div className="row g-3">
        {forms.map((form) => (
          <div key={form._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{form.title}</h5>
                <p className="card-text text-muted small">{form.description}</p>
                <p className="text-muted small mb-2">
                  Expires:{" "}
                  {form.expiresAt
                    ? new Date(form.expiresAt).toLocaleString()
                    : "No expiry"}
                </p>
                <div className="mt-auto">
                  <button
  className="btn btn-sm btn-outline-primary me-2"
  onClick={() => {
    const link = `${window.location.origin}/forms/${form._id}`;
    navigator.clipboard.writeText(link);
    alert("Form link copied!");
  }}
>
  Copy Link
</button>

                  <Link
                    to={`/responses/${form._id}`}
                    className="btn btn-sm btn-outline-success"
                  >
                    View Responses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);
}
