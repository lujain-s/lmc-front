import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function AddStudent({ onSubmit, onClose }) {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    accountCreated: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!student.name.trim()) newErrors.name = "Name is required";
    if (!student.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(student.email)) newErrors.email = "Invalid email";
    if (!student.password) newErrors.password = "Password is required";
    if (!student.accountCreated) newErrors.accountCreated = "Date is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    // إرسال البيانات إلى الأب (المكون الأم) ثم إغلاق المودال
    onSubmit(student);
    setLoading(false);
    onClose();
  };

  return (
    <Form style={{ color: "#1E3A5F" }} onSubmit={handleSubmit} noValidate>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Student Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={student.name}
          onChange={handleChange}
          placeholder="Enter student name..."
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={student.email}
          onChange={handleChange}
          placeholder="Enter email address..."
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={student.password}
          onChange={handleChange}
          placeholder="Enter password..."
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="accountCreated">
        <Form.Label>Account Created</Form.Label>
        <Form.Control
          type="date"
          name="accountCreated"
          value={student.accountCreated}
          onChange={handleChange}
          isInvalid={!!errors.accountCreated}
        />
        <Form.Control.Feedback type="invalid">{errors.accountCreated}</Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
  type="submit"
  style={{
    backgroundColor: "#1E3A5F",
    borderColor: "#1E3A5F",
    borderWidth: "2px",
    borderStyle: "solid",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = "#FF7F00";
    e.currentTarget.style.borderColor = "#FF7F00";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = "#1E3A5F";
    e.currentTarget.style.borderColor = "#1E3A5F";
  }}
  disabled={loading}
>
  {loading ? "Adding..." : "Add Student"}
</Button>

      </div>
    </Form>
  );
}
