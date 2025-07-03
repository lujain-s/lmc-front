import { useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import InvoiceDetails from "./invoiceDetails";
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
  const [actionId, setActionId] = useState("");
  const fetchInvoices = async () => {
    try {
      const response = await request.get("secretarya/showAllInvoices");
      console.log(response);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  };
  const handleView = (id) => {
    setOpenModal(true);
    setActionId(id);
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
                Error: {error?.message || "Failed to load rooms"}
              </td>
            </tr>
          ) : invoices.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No rooms found.
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
                      invoice.status === "Available"
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
        onHide={() => setOpenModal("")}
        size="lg"
        centered
      >
        <Modal.Body
          style={{ background: "transparent", boxShadow: "none", padding: 0 }}
        >
          <InvoiceDetails invoiceId={actionId} />
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
      `}</style>
    </div>
  );
}
