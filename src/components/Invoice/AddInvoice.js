import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import Operations from "../back_component/Operations";
import { FaUpload, FaEye, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import "../../styles/colors.css";

const AddInvoice = ({ onSubmit, taskId = null }) => {
  const { request } = Operations();
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    TaskId: taskId || "",
    Amount: "",
    Image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await request.get("super-admin/showTasks");
      return res.data.Tasks || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  // Truncate description to first 50 characters
  const truncateDescription = (description) => {
    if (!description) return "No description";
    return description.length > 50
      ? description.substring(0, 50) + "..."
      : description;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please select a valid image file.");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size should be less than 5MB.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        Image: file,
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setErrorMsg("");
    }
  };

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      Image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setErrorMsg("");
    setLoading(true);

    // Validate form data
    if (!form.TaskId) {
      setErrors({ TaskId: "Task selection is required" });
      setLoading(false);
      return;
    }

    if (!form.Amount) {
      setErrors({ Amount: "Amount is required" });
      setLoading(false);
      return;
    }

    if (!form.Image) {
      setErrors({ Image: "Image is required" });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("TaskId", form.TaskId);
      formData.append("Amount", form.Amount);
      formData.append("Image", form.Image);

      const res = await request.post("logistic/createInvoice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Invoice has been created successfully!");
      setForm({
        TaskId: taskId || "",
        Amount: "",
        Image: null,
      });
      setImagePreview(null);
      onSubmit();
    } catch (err) {
      console.error("Error in createInvoice:", err.response || err.message);
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

      <Form.Group className="mb-3" controlId="taskId">
        <Form.Label>Select Task</Form.Label>
        <Form.Select
          name="TaskId"
          value={form.TaskId}
          onChange={handleChange}
          isInvalid={!!errors.TaskId}
          required
          className="form-control"
          disabled={tasksLoading}
        >
          <option value="">Choose a task...</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              ID: {task.id} - {truncateDescription(task.Description)} (Status:{" "}
              {task.Status})
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.TaskId}
        </Form.Control.Feedback>
        {tasksLoading && <small className="text-muted">Loading tasks...</small>}
        {tasksError && (
          <small className="text-danger">Failed to load tasks</small>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="amount">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          name="Amount"
          value={form.Amount}
          onChange={handleChange}
          placeholder="Enter amount..."
          isInvalid={!!errors.Amount}
          required
          className="form-control"
          step="0.01"
          min="0"
        />
        <Form.Control.Feedback type="invalid">
          {errors.Amount}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="image">
        <Form.Label>Invoice Image</Form.Label>
        <div className="d-flex align-items-center gap-2 mb-2">
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            isInvalid={!!errors.Image}
            required
            className="form-control"
            style={{ flex: 1 }}
          />
          <Button
            variant="outline-secondary"
            onClick={() => document.getElementById("image").click()}
            style={{
              borderColor: "#1E3A5F",
              color: "#1E3A5F",
            }}
          >
            <FaUpload />
          </Button>
        </div>
        <Form.Control.Feedback type="invalid">
          {errors.Image}
        </Form.Control.Feedback>
        <small className="text-muted">
          Accepted formats: JPG, PNG, GIF. Max size: 5MB
        </small>
      </Form.Group>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            <strong>Image Preview:</strong>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={removeImage}
              style={{
                borderColor: "#dc3545",
                color: "#dc3545",
              }}
            >
              <FaTimes />
            </Button>
          </div>
          <div className="position-relative" style={{ maxWidth: "300px" }}>
            <img
              src={imagePreview}
              alt="Preview"
              className="img-fluid rounded border"
              style={{
                maxHeight: "200px",
                objectFit: "cover",
                width: "100%",
              }}
            />
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end">
        <Button
          className="button-blue px-5"
          type="submit"
          disabled={loading}
          style={{ fontWeight: 600, fontSize: 18 }}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Creating...
            </>
          ) : (
            "Create Invoice"
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
        
        .button-blue {
          background-color: #1E3A5F;
          border-color: #1E3A5F;
          color: white;
        }
        
        .button-blue:hover {
          background-color: #FF7F00;
          border-color: #FF7F00;
          color: white;
        }
      `}</style>
    </Form>
  );
};

export default AddInvoice;
