import { Modal, Button, Spinner } from "react-bootstrap";

export default function Confirm({
  show,
  title = "",
  message,
  onSuccess,
  onClose,
  loading,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      {title && (
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body className="text-center">
        <p className="fs-5 text-dark">{message}</p>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button
            variant="primary"
            onClick={onClose}
            style={{
              backgroundColor: "#1E3A5F",
              borderColor: "#1E3A5F",
              borderRadius: "8px",
              padding: "8px 20px",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onSuccess}
            disabled={loading}
            style={{
              borderRadius: "8px",
              padding: "8px 20px",
            }}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
