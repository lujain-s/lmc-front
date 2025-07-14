import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Operations from "../back_component/Operations";

const UploadQuestions = ({ show, onHide, onUploadSuccess }) => {
  const { request } = Operations();
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFile(null);
    setDescription("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("Description", description); // تأكد الباك يتوقع "Description" أو غير الاسم إذا مختلف

    setUploading(true);
    setError("");

    try {
      await request.post("super-admin/upload-placement-questions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      if (onUploadSuccess) onUploadSuccess();
      if (onHide) onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        if (onHide) onHide();
      }}
      centered
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#1E3A5F", color: "white" }}
      >
        <Modal.Title>Upload a file</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-4">
          <Form.Label>Choose the file</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
            className="rounded"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>File description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the file description"
            disabled={uploading}
            className="rounded"
          />
        </Form.Group>

        {error && <p className="text-danger fw-semibold">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            resetForm();
            if (onHide) onHide();
          }}
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? <Spinner animation="border" size="sm" /> : "Upload"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadQuestions;
