import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");


  const fakeEmployee = {
    1: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phone: "1234567890",
      dob: "1990-01-01",
    },
    2: {
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      phone: "0987654321",
      dob: "1985-05-15",
    },
    3: {
      name: "Alice Johnson",
      email: "alice.johnson@gmail.com",
      phone: "1112233445",
      dob: "1987-07-20",
    },
    4: {
      name: "Bob Brown",
      email: "bob.brown@gmail.com",
      phone: "6677889900",
      dob: "1992-11-25",
    },
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    if (fakeEmployee[id]) {
      setForm(fakeEmployee[id]);
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated employee:", form);
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <div className="row text-center mt-5 mb-2">
        <div className="col-lg-7 mx-auto">
          <h1
            className="display-5"
            style={{ letterSpacing: "5px", color: "#FF7F00" }}
          >
            Edit Employee
          </h1>
          <p className="lead mb-0" style={{ color: "#1E3A5F" }}>
            Here you can edit employee information
          </p>
          <hr />
        </div>
      </div>

      {/* Custom Style */}
      <style>
        {`
          .custom-btn {
            background-color: #1E3A5F;
            border-color: #1E3A5F;
            color: white;
            transition: background-color 0.3s ease;
          }

          .custom-btn:hover,
          .custom-btn:focus {
            background-color: #FF7F00 !important;
            border-color: #FF7F00 !important;
            color: white;
          }

          .custom-btn:active {
            background-color: #FF7F00 !important;
            border-color: #FF7F00 !important;
            color: white;
          }

          input.form-control:focus,
          select.form-control:focus,
          textarea.form-control:focus {
            border-color: #FF7F00 !important;
            box-shadow: 0 0 8px #FF7F00 !important;
            outline: none;
          }
        `}
      </style>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div
              className="card-header text-white"
              style={{ backgroundColor: "#1E3A5F" }}
            >
              <h4 className="mb-0">Edit Employee Information</h4>
              {successMessage && (
               <div className="alert alert-success mt-3 mb-0" role="alert">
                 {successMessage}
               </div>
                )}
            </div>
            <div className="card-body" style={{ color: "#1E3A5F" }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn custom-btn w-100">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
