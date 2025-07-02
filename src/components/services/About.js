// src/components/About/About.tsx

import "../../styles/colors.css";
import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import "./About.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Operations from "../back_component/Operations";

// ✅ إذا كنت تستخدم context للمستخدم
// import { AuthContext } from "../../context/AuthContext";

const About = () => {
  const { request } = Operations();
  const [aboutData, setAboutData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    Title: "",
    Photo: null,
    Description: [],
  });

  const { user } = Operations();
  const isAdmin = user?.role === "SuperAdmin" || false;
  const [loadingPage, setloadingPage] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setloadingPage(true);
      const res = await request.get("viewLMCInfo");
      setAboutData(res.data);
      setFormState({
        Title: res.data.Title,
        Description: res.data.Description,
        Photo: null,
      });
    } catch (err) {
      console.error("Error fetching about data:", err);
    } finally {
      setloadingPage(false);
    }
  };

  const handleChange = (index, field, value) => {
    const newDesc = [...formState.Description];
    newDesc[index][field] = value;
    setFormState({ ...formState, Description: newDesc });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("Title", formState.Title);
    if (formState.Photo) {
      formData.append("Photo", formState.Photo);
    }
    formState.Description.forEach((desc, index) => {
      formData.append(`Descriptions[${index}][Title]`, desc.Title);
      formData.append(`Descriptions[${index}][Explanation]`, desc.Explanation);
    });

    try {
      await request.post(
        "http://localhost:8000/api/super-admin/editLMCInfo",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowModal(false);
      fetchAboutData();
    } catch (err) {
      console.error("Error updating about data:", err);
    }
  };

  return (
    <div className="about-section">
      <Container>
        {loadingPage ? (
          <p>Loading...</p>
        ) : (
          <Row className="align-items-center">
            <Col md={6} className="about-image-col text-center mb-4 mb-md-0">
              <img
                src={aboutData?.Photo || ""}
                className="about-image shadow"
                alt="About"
              />
            </Col>
            <Col md={6} className="about-text">
              <div className="about-card">
                <h2 className="section-title mb-3">{aboutData?.Title}</h2>

                {/* الفقرة الرئيسية (شرح المركز) */}
                {aboutData?.Description?.[0] && (
                  <p className="about-description">
                    {aboutData.Description[0].Explanation}
                  </p>
                )}

                {/* الموقع */}
                {aboutData?.Description?.[1] && (
                  <div className="about-location mt-4">
                    <FaMapMarkerAlt className="me-2" />
                    <a
                      href="https://www.google.com/maps/place/Language+Mastery+Center/@33.4890102,36.3438096,17z/data=!3m1!4b1!4m6!3m5!1s0x1518e10067fbeef9:0xf7c00280f3fa92a7!8m2!3d33.4890102!4d36.3438096!16s%2Fg%2F11vqhwwwp9?entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                      }}
                    >
                      {aboutData.Description[1].Title}
                    </a>
                  </div>
                )}

                {/* زر التعديل */}
                {isAdmin && (
                  <Button
                    variant="dark"
                    className="mt-3"
                    onClick={() => setShowModal(true)}
                  >
                    تعديل المعلومات
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* 🟨 Modal for editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#0d3c6e",
            color: "white",
            borderBottom: "none",
          }}
        >
          <Modal.Title>Edit Center Information</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter center title..."
              value={formState.Title}
              onChange={(e) =>
                setFormState({ ...formState, Title: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormState({ ...formState, Photo: e.target.files[0] })
              }
            />
          </Form.Group>

          {formState.Description.map((desc, index) => (
            <div key={index}>
              <Form.Group className="mb-2">
                <Form.Label>Section Title {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Enter section ${index + 1} title...`}
                  value={desc.Title}
                  onChange={(e) => handleChange(index, "Title", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Explanation</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter explanation..."
                  value={desc.Explanation}
                  onChange={(e) =>
                    handleChange(index, "Explanation", e.target.value)
                  }
                />
              </Form.Group>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{ backgroundColor: "#0d3c6e", borderColor: "#0d3c6e" }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default About;
