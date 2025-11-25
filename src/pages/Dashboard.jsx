import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, formId: null, formTitle: "" });
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const nav = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const res = await API.get("/api/forms/myforms");
        setForms(res.data);
      } catch {
        nav("/login");
      } finally {
        setLoading(false);
      }
    };
    loadForms();
  }, [nav]);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleDeleteClick = (formId, formTitle) => {
    setDeleteModal({ show: true, formId, formTitle });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await API.delete(`/api/forms/${deleteModal.formId}`);
      setForms(forms.filter(form => form._id !== deleteModal.formId));
      showNotification("Form deleted successfully!", "success");
      setDeleteModal({ show: false, formId: null, formTitle: "" });
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to delete form", "danger");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, formId: null, formTitle: "" });
  };

  return (
    <>
      <Navbar />

      {/* Notification Toast */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          minWidth: '300px'
        }}>
          <div className={`alert alert-${notification.type} fade-in`}>
            {notification.message}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <>
          <div className="modal-backdrop show" onClick={handleDeleteCancel}></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scale-in">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">🗑️ Delete Form</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2">Are you sure you want to delete this form?</p>
                  <p className="fw-bold text-danger mb-0">"{deleteModal.formTitle}"</p>
                  <p className="text-muted small mt-2">This action cannot be undone. All responses will be permanently deleted.</p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete Form"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
          <div>
            <h2 className="mb-1 fw-bold text-gradient" style={{ fontSize: '2.5rem' }}>
              My Forms
            </h2>
            <p className="text-white mb-0" style={{ opacity: 0.9 }}>
              Manage and track all your forms in one place
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/create" className="btn btn-primary">
              <span style={{ fontSize: '18px', marginRight: '6px' }}>+</span>
              Create Form
            </Link>
            <button className="btn btn-outline-secondary" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3">Loading your forms...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && forms.length === 0 && (
          <div className="text-center py-5 fade-in">
            <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h4 className="text-white fw-bold mb-3">No Forms Yet</h4>
              <p className="text-white mb-4" style={{ opacity: 0.8 }}>
                Get started by creating your first form. It's quick and easy!
              </p>
              <Link to="/create" className="btn btn-primary btn-lg">
                <span style={{ fontSize: '20px', marginRight: '8px' }}>+</span>
                Create Your First Form
              </Link>
            </div>
          </div>
        )}

        {/* Forms Grid */}
        {!loading && forms.length > 0 && (
          <div className="row g-4">
            {forms.map((form, index) => (
              <div
                key={form._id}
                className="col-md-6 col-lg-4 scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card h-100 position-relative">
                  <div className="card-body d-flex flex-column p-4">
                    {/* Form Icon */}
                    <div className="mb-3">
                      <div
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '24px'
                        }}
                      >
                        📋
                      </div>
                    </div>

                    {/* Form Title & Description */}
                    <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.25rem' }}>
                      {form.title}
                    </h5>
                    <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                      {form.description || "No description provided"}
                    </p>

                    {/* Expiry Info */}
                    <div className="mb-3">
                      <span
                        className="badge"
                        style={{
                          background: form.expiresAt && new Date() > new Date(form.expiresAt)
                            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        {form.expiresAt
                          ? `⏰ Expires: ${new Date(form.expiresAt).toLocaleDateString()}`
                          : "♾️ No expiry"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary flex-grow-1"
                        onClick={() => {
                          const link = `${window.location.origin}/forms/${form._id}`;
                          navigator.clipboard.writeText(link);
                          showNotification("Form link copied to clipboard!", "success");
                        }}
                        title="Copy form link"
                      >
                        🔗 Copy Link
                      </button>

                      <Link
                        to={`/responses/${form._id}`}
                        className="btn btn-sm btn-outline-success flex-grow-1"
                        title="View responses"
                      >
                        📊 Responses
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(form._id, form.title)}
                        title="Delete form"
                        style={{ minWidth: '40px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

