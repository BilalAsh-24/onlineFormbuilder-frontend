import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function ViewResponses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/api/responses/${id}/responses`);
        setResponses(res.data);
      } catch (error) {
        setErr("Unable to load responses.");
      }
    };
    load();
  }, [id]);

  return (
    <div className="container py-4">
      <h3 className="mb-3">Responses</h3>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      {responses.length === 0 && !err && (
        <div className="alert alert-info">No responses yet.</div>
      )}

      <div className="row g-3">
        {responses.map((r) => (
          <div key={r._id} className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted small mb-2">
                  From: {r.respondentEmail} <br />
                  <span className="small">
                    {new Date(r.submittedAt).toLocaleString()}
                  </span>
                </p>
                <ul className="mb-0">
                  {r.answers.map((a, idx) => (
                    <li key={idx}>
                      <strong>{a.questionText}</strong>: {a.answer}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
