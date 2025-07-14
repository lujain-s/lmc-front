import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import Operations from "../back_component/Operations";

const EditFileModal = ({ show, onHide, fileData, onEditSuccess }) => {
  const { request } = Operations();
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // حالة النجاح

  useEffect(() => {
    if (fileData) {
      setDescription(fileData.Description || "");
      setFile(null);
      setError("");
      setSuccess(false);
    }
  }, [fileData, show]);

  const handleEdit = async () => {
    setError("");
    setSuccess(false);

    if (!description.trim() && !file) {
      setError("Please provide a description or select a new file to update.");
      return;
    }

    const formData = new FormData();
    if (description.trim()) formData.append("Description", description);
    if (file) formData.append("file", file);

    setLoading(true);

    try {
      const res = await request.post(`secretarya/editFileInLibrary/${fileData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);

      // استدعاء نجاح التعديل لرفرش البيانات
      onEditSuccess();

      // إغلاق المودال تلقائياً بعد 2 ثانية
      setTimeout(() => {
        setSuccess(false);
        onHide();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header 
        closeButton 
        style={{ backgroundColor: "#1E3A5F", color: "white" }}
      >
        <Modal.Title>Edit File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && (
          <Alert variant="success" className="text-center">
            تم التعديل بنجاح!
          </Alert>
        )}

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter file description"
            disabled={loading || success}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Change File (optional)</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading || success}
          />
        </Form.Group>

        {error && <p className="text-danger fw-semibold">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading || success}>
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
          onClick={handleEdit}
          disabled={loading || success}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditFileModal;
