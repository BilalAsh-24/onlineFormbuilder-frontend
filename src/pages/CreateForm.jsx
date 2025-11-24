import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", questionType: "text", options: [], required: false },
  ]);
  const [expiresAt, setExpiresAt] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { questionText: "", questionType: "text", options: [], required: false },
    ]);

  const updateQuestion = (i, key, value) => {
    const updated = [...questions];
    updated[i][key] = value;
    setQuestions(updated);
  };

  const addOption = (i) => {
    const updated = [...questions];
    updated[i].options.push("");
    setQuestions(updated);
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await API.post("/api/forms/create", {
        title,
        description,
        questions,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      nav("/dashboard");
    } catch (error) {
      setErr("Failed to create form");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">Create Form</h3>
      <div className="card shadow-sm">
        <div className="card-body">
          {err && <div className="alert alert-danger py-2">{err}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Form Title</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <h6>Questions</h6>
            {questions.map((q, i) => (
              <div key={i} className="border rounded p-3 mb-3">
                <div className="mb-2">
                  <label className="form-label">Question {i + 1}</label>
                  <input
                    className="form-control"
                    value={q.questionText}
                    onChange={(e) =>
                      updateQuestion(i, "questionText", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-2 d-flex gap-2 align-items-center">
                  <select
                    className="form-select form-select-sm w-auto"
                    value={q.questionType}
                    onChange={(e) =>
                      updateQuestion(i, "questionType", e.target.value)
                    }
                  >
                    <option value="text">Short Answer</option>
                    <option value="multipleChoice">Multiple Choice</option>
                  </select>

                  <div className="form-check ms-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        updateQuestion(i, "required", e.target.checked)
                      }
                      id={`required-${i}`}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor={`required-${i}`}
                    >
                      Required
                    </label>
                  </div>
                </div>

                {q.questionType === "multipleChoice" && (
                  <div className="mt-2">
                    {q.options.map((opt, oi) => (
                      <input
                        key={oi}
                        className="form-control form-control-sm mb-2"
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateOption(i, oi, e.target.value)
                        }
                      />
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => addOption(i)}
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm mb-3"
              onClick={addQuestion}
            >
              + Add Question
            </button>

            <div className="mb-3">
              <label className="form-label">Expiry (optional)</label>
              <input
                type="datetime-local"
                className="form-control"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <button className="btn btn-primary">Create Form</button>
          </form>
        </div>
      </div>
    </div>
  );
}
