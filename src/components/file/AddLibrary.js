import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import Operations from "../back_component/Operations";

export default function AddLibrary({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    languageId: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { request } = Operations();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await request.post("secretarya/addLanguageToLibrary", {
        language_id: parseInt(formData.languageId),
      });

      setSuccess(res.data.message);
      setFormData({ languageId: "" });

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error in addLibrary:", err.response || err.message);

      if (err.response) {
        if (err.response.status === 422) {
          setErrors({ languageId: "Validation failed: language ID not found." });
        } else if (err.response.status === 409) {
          setErrorMsg("This language already has a library.");
        } else if (err.response.status === 401) {
          setErrorMsg("Unauthorized: Please log in again.");
        } else {
          setErrorMsg(
            `An error occurred during addition: ${err.response.status} - ${err.response.statusText}`
          );
        }
      } else {
        setErrorMsg(`An error occurred during addition: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setFormData({ languageId: "" });
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    if (onClose) onClose();
  };

  return (
    <Form style={{ color: "#1E3A5F" }} onSubmit={handleSubmit}>
      {success && <Alert variant="success">{success}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form.Group className="mb-3" controlId="languageId">
        <Form.Label>Language ID</Form.Label>
        <Form.Control
          type="number"
          name="languageId"
          value={formData.languageId}
          onChange={handleChange}
          placeholder="Enter language ID..."
          required
          className="rounded"
          isInvalid={!!errors.languageId}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.languageId}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="custom-btn" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Adding...
            </>
          ) : (
            "Add Library"
          )}
        </Button>
      </div>
    </Form>
  );
}
