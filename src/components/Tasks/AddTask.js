import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Operations from '../back_component/Operations';

const AddTask = () => {
  const { request, user } = Operations();
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



  useEffect(() => {
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
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
      const res = await request.post('super-admin/assignTask', data);
      setSuccess("The task has been added successfully!");
      setForm({
        Description: "",
        Deadline: "",
        RequiresInvoice: false,
        role_id: "",
        assigned_user_id: "",
      });
      
    } catch (err) {
      console.error("Error in addTask:", err.response || err.message);
      if (err.response) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors || {});
        } else if (err.response.status === 401) {
          setErrorMsg("Unauthorized: Please log in again.");
        } else if (err.response.status === 400) {
          setErrorMsg(err.response.data.message || `An error occurred: ${err.response.status}`);
        } else {
          setErrorMsg(`An error occurred: ${err.response.status} - ${err.response.statusText}`);
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
        <Form.Control
          type="text"
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          placeholder="Enter Role ID"
          isInvalid={!!errors.role_id}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.role_id}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="assignedUserId">
        <Form.Label>Assign to User ID</Form.Label>
        <Form.Control
          type="number"
          name="assigned_user_id"
          value={form.assigned_user_id}
          onChange={handleChange}
          placeholder="Enter User ID to assign task"
          isInvalid={!!errors.user_id}
        />
        <Form.Control.Feedback type="invalid">
          {errors.user_id}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button className="custom-btn" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Saving...
            </>
          ) : (
            "Add Task"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default AddTask;
