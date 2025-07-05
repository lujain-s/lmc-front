import React, { useEffect, useState } from "react";
import Operations from "../back_component/Operations";
import {
  FaImage,
  FaEye,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import "../../styles/colors.css";

export default function InvoiceDetails({ invoiceId }) {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const { request } = Operations();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await request.get(`secretarya/showInvoice/${invoiceId}`);
        setInvoiceData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <p>Loading invoice...</p>;
  if (error) return <p>{error}</p>;
  if (!invoiceData || !invoiceData.invoice)
    return <p>No invoice data available.</p>;

  const { invoice, approval_status, all_approved, current_user_approved } =
    invoiceData;

  return (
    <div
      className="container py-5"
      style={{ background: "#1e3a5f", minHeight: "100vh" }}
    >
      <div
        className="card shadow rounded-4 border-0 mx-auto"
        style={{ maxWidth: "800px", background: "#fff" }}
      >
        <div className="text-center pt-4">
          {invoice.Image ? (
            <div className="position-relative d-inline-block">
              <img
                src={invoice.Image}
                alt="Invoice"
                className="rounded shadow cursor-pointer"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "1rem",
                  border: "3px solid var(--primary-color)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s ease",
                }}
                onClick={() => setShowImageModal(true)}
                onMouseOver={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              />
              <div className="mt-2">
                <small className="text-muted">
                  <FaEye className="me-1" />
                  Click to view full size
                </small>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <FaImage
                style={{
                  fontSize: "4rem",
                  color: "#ccc",
                  marginBottom: "1rem",
                }}
              />
              <p className="text-muted">No image available</p>
            </div>
          )}
        </div>
        <div className="px-4 pb-4">
          <h3
            className="text-center mb-3"
            style={{ color: "#FF7F00", fontWeight: 700 }}
          >
            Invoice #{invoice.id}
          </h3>

          {invoice.created_at && (
            <p className="text-center text-muted mb-4" style={{ fontSize: 15 }}>
              Created on: {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          )}

          <hr />

          {/* Invoice Basic Information */}
          <div className="row text-start mb-3">
            <div className="col-md-6 mb-2">
              <span style={{ color: "#1E3A5F", fontWeight: 600 }}>Amount:</span>
              <span className="ms-2">${invoice.Amount}</span>
            </div>
            <div className="col-md-6 mb-2">
              <span style={{ color: "#1E3A5F", fontWeight: 600 }}>Status:</span>
              <span
                className="ms-2 badge"
                style={{
                  background:
                    invoice.Status === "approved"
                      ? "#28a745"
                      : invoice.Status === "Sent"
                      ? "#1E3A5F"
                      : "#ffc107",
                  color: "#fff",
                  fontSize: 15,
                }}
              >
                {invoice.Status}
              </span>
            </div>
            <div className="col-md-6 mb-2">
              <span style={{ color: "#1E3A5F", fontWeight: 600 }}>
                Created by:
              </span>
              <span className="ms-2">
                {invoice.creator.name} ({invoice.creator.email})
              </span>
            </div>
            <div className="col-md-6 mb-2">
              <span style={{ color: "#1E3A5F", fontWeight: 600 }}>
                User Role ID:
              </span>
              <span className="ms-2">{invoice.creator.role_id}</span>
            </div>
            <div className="col-md-6 mb-2">
              <span style={{ color: "#1E3A5F", fontWeight: 600 }}>
                Account Created:
              </span>
              <span className="ms-2">
                {new Date(invoice.creator.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Task Details */}
          {invoice.task && (
            <div className="mt-4 text-start">
              <h5 style={{ color: "#FF7F00", fontWeight: 700 }}>
                <FaCheckCircle className="me-2" />
                Task Details
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Task ID:</strong> {invoice.task.id}
                  </p>
                  <p>
                    <strong>Description:</strong> {invoice.task.Description}
                  </p>
                  <p>
                    <strong>Status:</strong> {invoice.task.Status}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {new Date(invoice.task.Deadline).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Requires Invoice:</strong>{" "}
                    {invoice.task.RequiresInvoice ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(invoice.task.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <hr />

          {/* Recipients Information */}
          {invoice.recipients && invoice.recipients.length > 0 && (
            <div className="mt-4 text-start">
              <h5 style={{ color: "#FF7F00", fontWeight: 700 }}>
                <FaUser className="me-2" />
                Recipients ({invoice.recipients.length})
              </h5>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th style={{ color: "#1E3A5F" }}>
                        <FaUser className="me-2" />
                        Name
                      </th>
                      <th style={{ color: "#1E3A5F" }}>
                        <FaEnvelope className="me-2" />
                        Email
                      </th>
                      <th style={{ color: "#1E3A5F" }}>
                        <FaCheckCircle className="me-2" />
                        Status
                      </th>
                      <th style={{ color: "#1E3A5F" }}>
                        <FaClock className="me-2" />
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.recipients.map((recipient) => (
                      <tr key={recipient.id}>
                        <td>{recipient.user.name}</td>
                        <td>{recipient.user.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              recipient.Status === "approved"
                                ? "bg-success"
                                : recipient.Status === "Pending"
                                ? "bg-warning"
                                : "bg-secondary"
                            }`}
                          >
                            {recipient.Status}
                          </span>
                        </td>
                        <td>
                          {new Date(recipient.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <hr />

          {/* Approval Status */}
          <div className="mt-4 text-start">
            <h5 style={{ color: "#FF7F00", fontWeight: 700 }}>
              <FaCheckCircle className="me-2" />
              Approval Status
            </h5>
            <div className="row mb-3">
              <div className="col-md-6">
                <p>
                  <strong>All Approved:</strong>{" "}
                  {all_approved ? (
                    <span style={{ color: "#28a745" }}>✅ Yes</span>
                  ) : (
                    <span style={{ color: "#dc3545" }}>❌ No</span>
                  )}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>You Approved:</strong>{" "}
                  {current_user_approved ? (
                    <span style={{ color: "#28a745" }}>✅ Yes</span>
                  ) : (
                    <span style={{ color: "#dc3545" }}>❌ No</span>
                  )}
                </p>
              </div>
            </div>

            {approval_status.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th style={{ color: "#1E3A5F" }}>
                        <FaUser className="me-2" />
                        User Name
                      </th>
                      <th style={{ color: "#1E3A5F" }}>
                        <FaCheckCircle className="me-2" />
                        Status
                      </th>
                      <th style={{ color: "#1E3A5F" }}>
                        <FaClock className="me-2" />
                        Approved At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {approval_status.map((approval, index) => (
                      <tr key={index}>
                        <td>{approval.user_name}</td>
                        <td>
                          <span
                            className={`badge ${
                              approval.status === "approved"
                                ? "bg-success"
                                : approval.status === "Pending"
                                ? "bg-warning"
                                : "bg-secondary"
                            }`}
                          >
                            {approval.status}
                          </span>
                        </td>
                        <td>
                          {approval.approved_at
                            ? new Date(approval.approved_at).toLocaleString()
                            : "Not approved yet"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No approval status available.</p>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              className="button-blue px-4"
              style={{ fontWeight: 600, fontSize: 18 }}
              onClick={() => window.history.back()}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>

      {/* Modal لعرض الصورة بحجم كامل */}
      {invoice.Image && (
        <div
          className={`modal fade ${showImageModal ? "show" : ""}`}
          style={{ display: showImageModal ? "block" : "none" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Invoice Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowImageModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={invoice.Image}
                  alt="Invoice Full Size"
                  className="img-fluid"
                  style={{ maxHeight: "70vh" }}
                />
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowImageModal(false)}
          ></div>
        </div>
      )}

      <style>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .button-blue {
          background-color: #1E3A5F;
          border-color: #1E3A5F;
          color: white;
        }
        
        .button-blue:hover {
          background-color: #FF7F00;
          border-color: #FF7F00;
          color: white;
        }
      `}</style>
    </div>
  );
}
