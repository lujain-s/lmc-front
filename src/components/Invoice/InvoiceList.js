import { useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import InvoiceDetails from "./invoiceDetails";

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
      <h3 className="text-center mb-4" style={{ color: "#1E3A5F" }}>
        Rooms List
      </h3>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ color: "#1E3A5F" }}>#</th>
            <th style={{ color: "#1E3A5F" }}>Amount</th>
            <th style={{ color: "#1E3A5F" }}>Status</th>
            <th style={{ color: "#1E3A5F" }}>Created At</th>
            <th style={{ color: "#1E3A5F" }}>Actions</th>
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
                    className="btn btn-sm btn-primary me-2"
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
        <Modal.Body className="bg-darkblue ">
          <InvoiceDetails invoiceId={actionId} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
