import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Operations from "../back_component/Operations";
import "../../styles/colors.css";

const AddTask = ({ onSubmit }) => {
  const { request } = Operations();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Description: "",
    Deadline: "",
    RequiresInvoice: false,
    role_id: "",
    assigned_user_id: "",
  });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await request.get(
        `super-admin/getUsersByRoleId/${form.role_id}`
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    if (form.role_id) {
      fetchUsers();
    }
  }, [form.role_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    setLoading(true);

    const data = {
      Description: form.Description,
      Deadline: form.Deadline,
      RequiresInvoice: form.RequiresInvoice,
      role_id: form.role_id || null,
      user_id: form.assigned_user_id ? Number(form.assigned_user_id) : null,
    };

    try {
      const res = await request.post("super-admin/assignTask", data);
      setSuccess("The task has been added successfully!");
      setForm({
        Description: "",
        Deadline: "",
        RequiresInvoice: false,
        role_id: "",
        assigned_user_id: "",
      });
      onSubmit();
    } catch (err) {
      console.error("Error in addTask:", err.response || err.message);
      if (err.response) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors || {});
        } else if (err.response.status === 401) {
          setErrorMsg("Unauthorized: Please log in again.");
        } else if (err.response.status === 400) {
          setErrorMsg(
            err.response.data.message ||
              `An error occurred: ${err.response.status}`
          );
        } else {
          setErrorMsg(
            `An error occurred: ${err.response.status} - ${err.response.statusText}`
          );
        }
      } else {
        setErrorMsg(`An error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form style={{ color: "#1E3A5F" }} onSubmit={handleSubmit}>
      {success && <Alert variant="success">{success}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="Description"
          value={form.Description}
          onChange={handleChange}
          placeholder="Enter task description..."
          isInvalid={!!errors.Description}
          required
          className="form-control"
        />
        <Form.Control.Feedback type="invalid">
          {errors.Description}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="deadline">
        <Form.Label>Deadline</Form.Label>
        <Form.Control
          type="date"
          name="Deadline"
          value={form.Deadline}
          onChange={handleChange}
          isInvalid={!!errors.Deadline}
          required
          className="form-control"
        />
        <Form.Control.Feedback type="invalid">
          {errors.Deadline}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="requiresInvoice">
        <Form.Check
          type="checkbox"
          label="Requires Invoice"
          name="RequiresInvoice"
          checked={form.RequiresInvoice}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="roleId">
        <Form.Label>Role ID</Form.Label>
        <select
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          className={`form-control rounded ${
            errors.role_id ? "is-invalid" : ""
          }`}
        >
          <option value="">Select employee type...</option>
          <option value="2">Secretary</option>
          <option value="3">Teacher</option>
          <option value="4">Logistics</option>
        </select>
        <Form.Control.Feedback type="invalid">
          {errors.role_id}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="assignedUserId">
        <Form.Label>Assign to User</Form.Label>
        <select
          name="assigned_user_id"
          value={form.assigned_user_id}
          onChange={handleChange}
          className={`form-control rounded ${
            errors.user_id ? "is-invalid" : ""
          }`}
        >
          <option value="">Select a user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <Form.Control.Feedback type="invalid">
          {errors.user_id}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button
          className="button-blue px-5"
          type="submit"
          disabled={loading}
          style={{ fontWeight: 600, fontSize: 18 }}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Saving...
            </>
          ) : (
            "Add Task"
          )}
        </Button>
      </div>
      <style>{`
        input.form-control:focus,
        select.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }
      `}</style>
    </Form>
  );
};

export default AddTask;
