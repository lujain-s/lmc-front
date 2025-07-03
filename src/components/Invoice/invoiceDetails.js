import React, { useEffect, useState } from "react";
import Operations from "../back_component/Operations";
import "../../styles/colors.css";

export default function InvoiceDetails({ invoiceId }) {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      style={{ background: "#f5f7fa", minHeight: "100vh" }}
    >
      <div
        className="card shadow rounded-4 border-0 mx-auto"
        style={{ maxWidth: "700px", background: "#fff" }}
      >
        <div className="text-center pt-4">
          {invoice.image ? (
            <img
              src={`http://127.0.0.1:8000/storage/${invoice.image}`}
              alt="Invoice"
              className="rounded shadow"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginBottom: "1rem",
                border: "3px solid var(--primary-color)",
                boxShadow: "0 2px 8px #eee",
              }}
            />
          ) : (
            <p className="text-danger">No image available</p>
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
                    invoice.Status === "approved" ? "#FF7F00" : "#1E3A5F",
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

          {invoice.task && (
            <div className="mt-4 text-start">
              <h5 style={{ color: "#FF7F00", fontWeight: 700 }}>
                Task Details
              </h5>
              <p>
                <strong>Description:</strong> {invoice.task.Description}
              </p>
              <p>
                <strong>Status:</strong> {invoice.task.Status}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(invoice.task.Deadline).toLocaleDateString()}
              </p>
              <p>
                <strong>Requires Invoice:</strong>{" "}
                {invoice.task.RequiresInvoice ? "Yes" : "No"}
              </p>
              <p>
                <strong>Completed At:</strong>{" "}
                {new Date(invoice.task.Completed_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(invoice.task.created_at).toLocaleString()}
              </p>
            </div>
          )}

          <hr />

          <div className="mt-4 text-start">
            <h5 style={{ color: "#FF7F00", fontWeight: 700 }}>Approval Info</h5>
            <p>
              <strong>All Approved:</strong>{" "}
              {all_approved ? (
                <span style={{ color: "#28a745" }}>✅ Yes</span>
              ) : (
                <span style={{ color: "#dc3545" }}>❌ No</span>
              )}
            </p>
            <p>
              <strong>You Approved:</strong>{" "}
              {current_user_approved ? (
                <span style={{ color: "#28a745" }}>✅ Yes</span>
              ) : (
                <span style={{ color: "#dc3545" }}>❌ No</span>
              )}
            </p>

            {approval_status.length > 0 ? (
              <ul className="list-group">
                {approval_status.map((a, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex align-items-center justify-content-between"
                  >
                    <span>
                      <strong>{a.name}</strong> ({a.email})
                    </span>
                    <span
                      className={`badge`}
                      style={{
                        background:
                          a.status === "approved" ? "#FF7F00" : "#1E3A5F",
                        color: "#fff",
                        fontSize: 15,
                      }}
                    >
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No approvals yet.</p>
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
    </div>
  );
}
