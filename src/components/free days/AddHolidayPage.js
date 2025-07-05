import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import Operations from "../back_component/Operations";

export default function AddHolidayPage({ onClose, onSuccess, refetch }) {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { request } = Operations();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    setLoading(true);

    const data = {
      Name: formData.name,
      StartDate: formData.startDate,
      EndDate: formData.endDate,
      Description: formData.description,
    };

    try {
      const res = await request.post("super-admin/addHoliday", data);
      setSuccess("The holiday has been added successfully!");
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        description: "",
      });

      // إعادة جلب البيانات من المكون الأب
      if (refetch) {
        await refetch();
      }

      if (onClose) onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error in addHoliday:", err.response || err.message);
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
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    if (onClose) onClose(); // ✅ إغلاق المودال عند الإلغاء
  };

  return (
    <Form style={{ color: "#1E3A5F" }} onSubmit={handleSubmit}>
      {success && <Alert variant="success">{success}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form.Group className="mb-3" controlId="holidayName">
        <Form.Label>Holiday Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter holiday name..."
          required
          className="rounded"
          isInvalid={!!errors.Name}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.Name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="startDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="rounded"
          isInvalid={!!errors.StartDate}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.StartDate}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="endDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="rounded"
          isInvalid={!!errors.EndDate}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {errors.EndDate}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter holiday description (optional)..."
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
            "Add Holiday"
          )}
        </Button>
      </div>
    </Form>
  );
}
