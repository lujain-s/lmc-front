import { useState, useEffect } from "react";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Validator from "../back_component/Validator";
import Operations from "../back_component/Operations";

export default function AddEmployee({ onSuccess }) {
  const { isEmpty, isValidEmail, isValidPhone } = Validator();
  const { request } = Operations();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role_id, setrole_id] = useState("");
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (isEmpty(name)) newErrors.name = "Name is required.";
    if (isEmpty(email) || !isValidEmail(email))
      newErrors.email = "Valid email is required.";
    if (isEmpty(password) || password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (isEmpty(role_id)) newErrors.role_id = "Please select an employee type.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setErrors({});
    setLoading(true);

    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role_id", role_id);
        const response = await request.post("super-admin/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setSuccess("User added successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setrole_id("");
        onSuccess();
      } catch (error) {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="py-5"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      {/* CSS خاص بالتركيز focus على الحقول */}
      <style>{`
        input.form-control:focus,
        select.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }

        /* لون الظل البرتقالي عند تركيز المستخدم على label */
        label.form-label:focus-visible {
          box-shadow: 0 0 6px #FF7F00;
          outline: none;
          border-radius: 4px;
        }
      `}</style>

      <div className="row text-center mt-5 mb-2">
        <div className="col-lg-7 mx-auto">
          <h1 className="display-5" style={{ color: "#1E3A5F" }}>
            Add New Employee
          </h1>
          <p className="lead mb-0" style={{ color: "#FF7F00" }}>
            Here you can add a new employee
          </p>
          <hr />
        </div>
      </div>

      {success && (
        <div className="alert alert-success text-center" role="alert">
          {success}
        </div>
      )}

      {errors.general && (
        <div className="alert alert-danger text-center" role="alert">
          {errors.general}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow rounded-4 border-0">
            <div
              className="card-header text-center"
              style={{ backgroundColor: "#1E3A5F", color: "#fff" }}
            >
              <h3>Add New Employee</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3 text-start">
                  <label className="form-label" tabIndex={0}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`form-control rounded ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Enter name..."
                  />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>
                {/* Email */}
                <div className="mb-3 text-start">
                  <label className="form-label" tabIndex={0}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`form-control rounded ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter email..."
                  />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>
                {/* Password */}
                <div className="mb-3 text-start">
                  <label className="form-label" tabIndex={0}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-control rounded ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter password..."
                  />
                  <div className="invalid-feedback">{errors.password}</div>
                </div>
                {/* Employee Type */}
                <div className="mb-3 text-start">
                  <label className="form-label" tabIndex={0}>
                    Employee Type
                  </label>
                  <select
                    value={role_id}
                    onChange={(e) => setrole_id(e.target.value)}
                    className={`form-control rounded ${
                      errors.role_id ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select employee type...</option>
                    <option value="2">Secretary</option>
                    <option value="3">Teacher</option>
                    <option value="4">Logistics</option>
                  </select>
                  <div className="invalid-feedback">{errors.role_id}</div>
                </div>
                <button
                  type="submit"
                  className="w-100 rounded py-2 btn"
                  style={{
                    backgroundColor: "#1E3A5F",
                    color: "#fff",
                    transition:
                      "background-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF7F00";
                    e.currentTarget.style.boxShadow =
                      "0 0 12px rgba(255, 127, 0, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#1E3A5F";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Employee"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
