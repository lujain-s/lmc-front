import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Operations from "../back_component/Operations";

export default function EditEmployee({ initialData = {}, onsuccess }) {
  const { id } = initialData.id;
  const { request } = Operations();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [form, setForm] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    dob: initialData.dob || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const res = await request.put("")
    // } catch (Err) {
    //   console.error(Err);
    // }
    // console.log("Updated employee:", form);
    // onsuccess();
    console.log(form);
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
