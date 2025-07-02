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
    <div className="container mt-5">
      <div
        className="card shadow p-4 rounded"
        style={{
          maxWidth: "600px",
          margin: "auto",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 className="mt-3">{user.name}</h3>
        <p className="text-muted">{user.email}</p>

        <div className="mt-3">
          <p>
            <strong>Role:</strong> {roles.join(", ")}
          </p>
        </div>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <Button
            variant="primary"
            onClick={handleEditOpen}
            style={{ borderRadius: "8px", padding: "8px 16px" }}
          >
            تعديل البروفايل
          </Button>
          <Button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "#1E3A5F",
              borderColor: "#1E3A5F",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 16px",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f28c28";
              e.target.style.borderColor = "#f28c28";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#1E3A5F";
              e.target.style.borderColor = "#1E3A5F";
            }}
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
        <Modal.Header closeButton>
          <Modal.Title>تعديل البروفايل</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSave}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editEmail">
              <Form.Label>الإيميل</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleEditClose}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "حفظ التعديلات"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
