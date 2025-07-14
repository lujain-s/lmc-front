import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Operations from "../back_component/Operations";

const UploadFileModal = ({ show, onHide, libraryId, onUploadSuccess }) => {
  const { request } = Operations();
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onCancel = () => {
    setFile(null);
    setDescription("");
    setError("");
    if (onHide) onHide();
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
    if (!libraryId) {
      setError("Library ID is missing, cannot upload file.");
      return;
    }

    const formData = new FormData();
    formData.append("LibraryId", libraryId);
    formData.append("file", file);
    formData.append("Description", description);

    // Debug: تحقق من القيم المرسلة
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    setUploading(true);
    setError("");

    try {
      const res = await request.post("secretarya/uploadFile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      setDescription("");
      onUploadSuccess();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#1E3A5F", color: "white" }}>
        <Modal.Title>Upload File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-4">
          <Form.Label>Select File</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
            className="rounded"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter file description"
            disabled={uploading}
            className="rounded"
          />
        </Form.Group>

        {error && <p className="text-danger fw-semibold">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={uploading}>
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

export default UploadFileModal;
