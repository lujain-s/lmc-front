import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Operations from "../back_component/Operations";

const EditLanguageModal = ({ show, onHide, language, onUpdated }) => {
  const { request } = Operations();
  const [formData, setFormData] = useState({ Name: "", Description: "" });

  useEffect(() => {
    if (language) {
      setFormData({
        Name: language.Name || "",
        Description: language.Description || "",
      });
    }
  }, [language]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await request.post(`super-admin/updateLanguage/${language.id}`, formData);
      onHide();
      onUpdated();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Edit language</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>Name</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Enter the name"
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label style={{ fontWeight: "bold" }}>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Enter the description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button className="custom-btn" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* تنسيقات CSS داخلية مشابهة لـ TasksList */}
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
    </>
  );
};

export default EditLanguageModal;
