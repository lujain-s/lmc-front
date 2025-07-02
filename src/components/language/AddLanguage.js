import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import Operations from "../back_component/Operations";

export default function AddLanguage({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { request } = Operations();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    setLoading(true);

    const data = {
      Name: formData.name,
      Description: formData.description,
    };

    try {
      const res = await request.post("super-admin/addLanguage", data);
      setSuccess("The Language has been added successfully!");
      setFormData({
        name: "",
        description: "",
      });
      onClose();
    } catch (err) {
      console.error("Error in addLanguage:", err.response || err.message);
      if (err.response) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
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
    setFormData({ name: "", description: "" });
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    if (onClose) onClose();
  };

  return (
    <Form style={{ color: "#1E3A5F" }} onSubmit={handleSubmit}>
      {success && <Alert variant="success">{success}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form.Group className="mb-3" controlId="languageName">
        <Form.Label>Language Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter language name..."
          required
          className="rounded"
          isInvalid={!!errors.Name}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.Name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="languageDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a short description..."
          required
          className="rounded"
          isInvalid={!!errors.Description}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.Description}
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
            "Add Language"
          )}
        </Button>
      </div>
    </Form>
  );
}
