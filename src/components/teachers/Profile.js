import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Operations from "../back_component/Operations";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { request } = new Operations();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await request.get("profile");
        setProfile(res.data);
      } catch (error) {
        console.error("erorr is:", error);
        const msg =
          error.code === "ERR_NETWORK"
            ? "ERR_NETWORK: " + error.message
            : error.response?.data?.error ||
              error.response?.data?.message ||
              JSON.stringify(error.response?.data) ||
              "Unknown error";

        setErrors({ general: msg });
      }
    };

    fetchProfile();
  }, []);

  if (errors.general) {
    return (
      <Alert variant="danger" className="text-center mt-5">
        {errors.general}
      </Alert>
    );
  }

  if (!profile) return null;

  const { user, roles } = profile;

  // فتح المودال مع تعبئة البيانات الحالية
  const handleEditOpen = () => {
    setEditForm({ name: user.name, email: user.email });
    setShowEdit(true);
    setSuccessMsg("");
    setErrors({});
  };

  // إغلاق المودال
  const handleEditClose = () => {
    setShowEdit(false);
    setSuccessMsg("");
    setErrors({});
  };

  // عند تغيير الحقول
  const handleChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // عند حفظ التعديلات
  const handleEditSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");
    try {
      const res = await request.post("staff/editMyInfo", editForm);
      setSuccessMsg("تم تحديث البيانات بنجاح!");
      setProfile((prev) => ({ ...prev, user: { ...prev.user, ...editForm } }));
      setShowEdit(false);
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "حدث خطأ أثناء التحديث",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`body { background: #f5f7fa !important; }`}</style>
      <div className="container mt-4">
        <div
          className="card shadow p-3 rounded-4"
          style={{
            maxWidth: "380px",
            margin: "40px auto 0 auto",
            textAlign: "center",
            backgroundColor: "#fff",
            border: "1.5px solid #1E3A5F",
          }}
        >
          <h3
            className="mt-2 mb-1"
            style={{ color: "#1E3A5F", fontWeight: 700 }}
          >
            {user.name}
          </h3>
          <p
            className="text-muted mb-2"
            style={{ color: "#FF7F00", fontWeight: 500 }}
          >
            {user.email}
          </p>
          <div className="mt-2 mb-2">
            <p style={{ color: "#1E3A5F", fontWeight: 600 }}>
              <strong>Role:</strong> {roles.join(", ")}
            </p>
          </div>
          <div className="d-flex flex-column gap-2 mt-2">
            <Button
              variant="primary"
              onClick={handleEditOpen}
              style={{
                borderRadius: "12px",
                padding: "8px 0",
                backgroundColor: "#FF7F00",
                border: "none",
                fontWeight: 600,
                fontSize: "1rem",
                width: "100%",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e86c00")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#FF7F00")}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: "#1E3A5F",
                border: "none",
                color: "#fff",
                borderRadius: "12px",
                padding: "8px 0",
                fontWeight: 600,
                fontSize: "1rem",
                width: "100%",
                transition: "0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#FF7F00")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1E3A5F")}
            >
              ← Go Back
            </Button>
          </div>
          {successMsg && (
            <Alert variant="success" className="mt-3">
              {successMsg}
            </Alert>
          )}
          {errors.general && (
            <Alert variant="danger" className="mt-3">
              {errors.general}
            </Alert>
          )}
        </div>

        {/* مودال التعديل */}
        <Modal show={showEdit} onHide={handleEditClose} centered>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1E3A5F", color: "white" }}
          >
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleEditSave}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="editName">
                <Form.Label style={{ fontWeight: "bold" }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  required
                  className="form-control custom-input"
                  placeholder="Enter your name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="editEmail">
                <Form.Label style={{ fontWeight: "bold" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  required
                  className="form-control custom-input"
                  placeholder="Enter your email"
                />
              </Form.Group>
              {errors.general && (
                <Alert variant="danger">{errors.general}</Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleEditClose}
                disabled={loading}
                className="custom-btn"
              >
                Cancel
              </Button>
              <Button className="custom-btn" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Save"}
              </Button>
            </Modal.Footer>
          </Form>
          <style>{`
            .custom-btn {
              background-color: #1E3A5F;
              border-color: #1E3A5F;
              color: white;
              font-weight: bold;
            }
            .custom-btn:hover,
            .custom-btn:focus {
              background-color: #FF7F00 !important;
              border-color: #FF7F00 !important;
              color: white;
            }
            .custom-input:focus {
              border-color: #FF7F00 !important;
              box-shadow: 0 0 6px #FF7F00 !important;
            }
          `}</style>
        </Modal>
      </div>
    </>
  );
}
