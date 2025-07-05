import { useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import InvoiceDetails from "./invoiceDetails";
import AddInvoice from "./AddInvoice";
import {
  FaHashtag,
  FaMoneyBill,
  FaCheckCircle,
  FaCalendarPlus,
  FaCogs,
} from "react-icons/fa";

export default function InvoiceList() {
  const { request } = Operations();
  const [openModal, setOpenModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionId, setActionId] = useState("");

  const fetchInvoices = async () => {
    try {
      const response = await request.get("secretarya/showAllInvoices");
      console.log(response);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
  };

  const handleView = (id) => {
    setOpenModal(true);
    setActionId(id);
  };

  const handleAddInvoice = () => {
    setShowAddModal(false);
    refetch();
  };

  const {
    data: invoices = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="container py-4">
      <button
        className="btn rounded-circle"
        style={{
          position: "fixed",
          bottom: "60px",
          right: "30px",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          backgroundColor: "#1E3A5F",
          borderColor: "#1E3A5F",
          color: "#fff",
          boxShadow: "0 4px 8px #1E3A5F",
          zIndex: 1000,
          border: "none",
        }}
        onClick={() => setShowAddModal(true)}
      >
        +
      </button>

      <h1
        className="text-center text-uppercase mb-4"
        style={{ letterSpacing: "5px", color: "#FF7F00", fontWeight: 700 }}
      >
        Invoice List
      </h1>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ color: "#1E3A5F" }}>
              <FaHashtag className="me-2" />#
            </th>
            <th style={{ color: "#1E3A5F" }}>
              <FaMoneyBill className="me-2" />
              Amount
            </th>
            <th style={{ color: "#1E3A5F" }}>
              <FaCheckCircle className="me-2" />
              Status
            </th>
            <th style={{ color: "#1E3A5F" }}>
              <FaCalendarPlus className="me-2" />
              Created At
            </th>
            <th style={{ color: "#1E3A5F" }}>
              <FaCogs className="me-2" />
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Loading...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="6" className="text-center text-danger">
                Error: {error?.message || "Failed to load invoices"}
              </td>
            </tr>
          ) : invoices.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No invoices found.
              </td>
            </tr>
          ) : (
            invoices.map((invoice, index) => (
              <tr key={invoice.id}>
                <td>{index + 1}</td>
                <td>{invoice.amount}</td>
                <td>
                  <span
                    className={`badge ${
                      invoice.status === "approved"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td>{new Date(invoice.created_at).toLocaleString()}</td>
                <td>
                  <button
                    className="button-blue me-2"
                    onClick={() => handleView(invoice.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        size="lg"
        centered
      >
        <Modal.Body
          style={{ background: "transparent", boxShadow: "none", padding: 0 }}
        >
          <InvoiceDetails invoiceId={actionId} />
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Create New Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddInvoice onSubmit={handleAddInvoice} />
        </Modal.Body>
      </Modal>

      <style>{`
        input.form-control:focus,
        select.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
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
