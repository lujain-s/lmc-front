import { useState, useEffect } from "react";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Validator from "../back_component/Validator";
import Operations from "../back_component/Operations";

export default function AddEmployee() {
  const { isEmpty, isValidEmail, isValidPhone } = Validator();
  const navigate = useNavigate();
  const { request } = Operations();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [role_id, setrole_id] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [global_info, setGlobalInfo] = useState("");
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const validateForm = () => {
    let newErrors = {};
    if (isEmpty(name)) newErrors.name = "Name is required.";
    if (isEmpty(email) || !isValidEmail(email)) newErrors.email = "Valid email is required.";
    if (isEmpty(password) || password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    // if (isEmpty(phone) || !isValidPhone(phone)) newErrors.phone = "Valid phone number is required.";
    if (isEmpty(dob)) newErrors.dob = "Date of birth is required.";
    if (isEmpty(role_id)) newErrors.role_id = "Please select an employee type.";
    if (!imageFile) newErrors.image = "Please upload an image.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // إنشاء رابط معاينة جديد مع تحرير الرابط السابق
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(URL.createObjectURL(file));

      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  useEffect(() => {
    // تنظيف الرابط عند إزالة الصورة أو عند خروج المكون
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

 
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSuccess(null);
  //   setErrors({});
  //   setLoading(true);
  
  //   if (validateForm()) {
  //     try {
  //       const formData = new FormData();
  //       formData.append('name', name);
  //       formData.append('email', email);
  //       formData.append('password', password);
  //       formData.append('phone', phone);
  //       formData.append('dob', dob);
  //       formData.append('role_id', role_id);
  
  //       const response = await request.post('super-admin/register', formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });
  
  //       const userId = response.data.user.id;
  
  //       if (imageFile || global_info) {
  //         const infoFormData = new FormData();
  //         if (imageFile) infoFormData.append('Photo', imageFile);
  //         if (global_info) infoFormData.append('Description', global_info);
  
  //         // إرسال user_id مع البيانات
  //         infoFormData.append('user_id', userId);
  
  //         await request.post('staff/editMyInfo', infoFormData, {
  //           headers: { 'Content-Type': 'multipart/form-data' },
  //         });
  //       }
  
  //       setSuccess('User added successfully!');
  //       // إعادة تعيين الحقول ...
  //     } catch (error) {
  //       // التعامل مع الأخطاء ...
  //     }
  //   }
  //   setLoading(false);
  // };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setErrors({});
    setLoading(true);
  
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('dob', dob);
        formData.append('role_id', role_id);
  
        const response = await request.post('super-admin/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        const userId = response.data.user.id;
  
        if (imageFile || global_info) {
          const infoFormData = new FormData();
          if (imageFile) infoFormData.append('Photo', imageFile);
          if (global_info) infoFormData.append('Description', global_info);
  
          // إرسال user_id مع البيانات
          infoFormData.append('user_id', userId);
  
          await request.post('staff/editMyInfo', infoFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
  
        setSuccess('User added successfully!');
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setDob("");
        setrole_id("");
        setImageFile(null);
        setImagePreviewUrl(null);
        setGlobalInfo("");

      } catch (error) {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    }
    setLoading(false);
  };
  
  


 
  return (
    <div
      className="container py-5"
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
          <p className="lead mb-0" style={{ color: "#FF7F00" }}>Here you can add a new employee</p>
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
              {[
                  { label: "Name", value: name, setter: setName, type: "text", error: errors.name },
                  { label: "Email", value: email, setter: setEmail, type: "email", error: errors.email },
                  { label: "Password", value: password, setter: setPassword, type: "password", error: errors.password },
                  { label: "Phone Number", value: phone, setter: setPhone, type: "tel", error: errors.phone },
                  { label: "Date of Birth", value: dob, setter: setDob, type: "date", error: errors.dob }
                ].map((field, index) => (

                  <div className="mb-3 text-start" key={index}>
                    <label
                      className="form-label"
                      tabIndex={0} // للسماح بالتركيز على اللابل
                      onFocus={(e) =>
                        (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                      }
                      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className={`form-control rounded ${
                        field.error ? "is-invalid" : ""
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                    <div className="invalid-feedback">{field.error}</div>
                  </div>
                ))}

                <div className="mb-3 text-start">
                  <label
                    className="form-label"
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
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

                <div className="mb-3 text-start">
                  <label
                    className="form-label"
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    Additional Information
                  </label>
                  <textarea
                    value={global_info}
                    onChange={(e) => setGlobalInfo(e.target.value)}
                    className="form-control rounded"
                    rows="4"
                    placeholder="Enter additional information..."
                  ></textarea>
                </div>

                <div className="mb-3 text-start">
                  <label
                    className="form-label"
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`form-control rounded ${
                      errors.image ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">{errors.image}</div>
                </div>

                <button
                  type="submit"
                  className="w-100 rounded py-2 btn"
                  style={{
                    backgroundColor: "#1E3A5F",
                    color: "#fff",
                    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF7F00";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 127, 0, 0.5)";
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

        {imagePreviewUrl && (
          <div className="col-md-4 py-5">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body text-center">
                <h5 className="text-dark mb-4">Image Preview</h5>
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="rounded-circle shadow"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    border: "4px solid #1E3A5F",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
