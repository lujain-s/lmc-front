import React, { useEffect, useState } from "react";
import Operations from "../back_component/Operations";

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
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 rounded-lg bg-light"
        style={{
          maxWidth: "700px",
          margin: "auto",
          textAlign: "center",
          border: "1px solid #ddd",
        }}
      >
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
            }}
          />
        ) : (
          <p className="text-danger">No image available</p>
        )}

        <h3 className="text-primary">Invoice #{invoice.id}</h3>

        {invoice.created_at && (
          <p className="text-muted">
            Created on: {new Date(invoice.created_at).toLocaleDateString()}
          </p>
        )}

        <hr />

        <div className="text-start">
          <p>
            <strong>Amount:</strong> ${invoice.Amount}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="badge bg-info text-dark">{invoice.Status}</span>
          </p>
          <p>
            <strong>Created by:</strong> {invoice.creator.name} (
            {invoice.creator.email})
          </p>
          <p>
            <strong>User Role ID:</strong> {invoice.creator.role_id}
          </p>
          <p>
            <strong>Account Created:</strong>{" "}
            {new Date(invoice.creator.created_at).toLocaleString()}
          </p>
        </div>

        {invoice.task && (
          <div className="mt-4 text-start">
            <h5 className="text-secondary">Task Details</h5>
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
          <h5 className="text-secondary">Approval Info</h5>
          <p>
            <strong>All Approved:</strong> {all_approved ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>You Approved:</strong>{" "}
            {current_user_approved ? "✅ Yes" : "❌ No"}
          </p>

          {approval_status.length > 0 ? (
            <ul className="list-group">
              {approval_status.map((a, i) => (
                <li key={i} className="list-group-item">
                  <strong>{a.name}</strong> ({a.email}) -{" "}
                  <span
                    className={`badge bg-${
                      a.status === "approved" ? "success" : "secondary"
                    }`}
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

        <button
          className="btn btn-dark mt-4"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
