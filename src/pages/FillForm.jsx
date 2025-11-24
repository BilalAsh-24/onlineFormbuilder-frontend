import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function FillForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false); // 👈 NEW

  useEffect(() => {
    const load = async () => {
      try {
  const res = await API.get(`/api/forms/${id}`);
  setForm(res.data);
} catch (error) {
  if (error?.response?.status === 410) {
    setMsg("⏳ This form has expired. Please contact the owner.");
  } else if (error?.response?.status === 404) {
    setMsg("❌ Form not found.");
  } else {
    setMsg("⚠️ Unable to load form. Please try again later.");
  }
}
  };
    load();
  }, [id]);

  const handleChange = (idx, value) => {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post(`/api/responses/${id}`, {
        respondentEmail: email,
        answers: form.questions.map((q, idx) => ({
          questionText: q.questionText,
          answer: answers[idx] || "",
        })),
      });

      setSubmitted(true);          // 👈 mark as submitted
    } catch (error) {
      setMsg("Failed to submit response.");
    }
  };

  if (!form && !msg) {
    return (
      <div className="container py-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (msg && !form) {
  return (
    <div className="container py-4">
      <div className="alert alert-danger fw-bold text-center">
        {msg}
      </div>
    </div>
  );
}


  // 👇 After submit, show thank-you instead of redirecting
  if (submitted) {
  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h3>🎉 Thank you!</h3>
          <p className="text-muted">
            Your response has been recorded.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => {
              setAnswers({});
              setEmail("");
              setSubmitted(false);
            }}
          >
            Submit another response
          </button>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">{form.title}</h3>
          <p className="text-muted">{form.description}</p>

          {msg && <div className="alert alert-info py-2">{msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {form.questions.map((q, idx) => (
              <div key={idx} className="mb-3">
                <label className="form-label">
                  {q.questionText}
                  {q.required && <span className="text-danger"> *</span>}
                </label>

                {q.questionType === "text" ? (
                  <input
                    className="form-control"
                    value={answers[idx] || ""}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    required={q.required}
                  />
                ) : (
                  q.options.map((opt, oi) => (
                    <div className="form-check" key={oi}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`q${idx}`}
                        id={`q${idx}-opt${oi}`}
                        value={opt}
                        onChange={() => handleChange(idx, opt)}
                        required={q.required}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`q${idx}-opt${oi}`}
                      >
                        {opt}
                      </label>
                    </div>
                  ))
                )}
              </div>
            ))}

            <button className="btn btn-primary mt-2">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
