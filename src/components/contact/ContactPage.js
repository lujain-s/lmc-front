import "../../styles/colors.css";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
  FaLocationArrow,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import "./ContactPage.css";
import Operations from "../back_component/Operations";
import Select from "react-select";
import Confirm from "../ui/confirmMessage";

const iconMap = {
  FaFacebookF: <FaFacebookF />,
  FaInstagram: <FaInstagram />,
  FaEnvelope: <FaEnvelope />,
  FaWhatsapp: <FaWhatsapp />,
  FaPhone: <FaPhone />,
  FaLocationArrow: <FaLocationArrow />,
};
const iconOptions = [
  { label: "Facebook", value: "FaFacebookF", icon: <FaFacebookF /> },
  { label: "Instagram", value: "FaInstagram", icon: <FaInstagram /> },
  { label: "Envelope", value: "FaEnvelope", icon: <FaEnvelope /> },
  { label: "Whatsapp", value: "FaWhatsapp", icon: <FaWhatsapp /> },
  {
    label: "Phone",
    value: "FaPhone",
    icon: <FaPhone />,
  },
  { label: "Location", value: "FaLocationArrow", icon: <FaLocationArrow /> },
];

const customSingleValue = ({ data }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {typeof data.icon === "string" ? (
      <img
        src={data.icon}
        alt={data.label}
        style={{ width: 24, marginRight: 8 }}
      />
    ) : (
      <span style={{ fontSize: 20, marginRight: 8 }}>{data.icon}</span>
    )}
    {data.label}
  </div>
);
const customOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ display: "flex", alignItems: "center", padding: 10 }}
    >
      {typeof data.icon === "string" ? (
        <img
          src={data.icon}
          alt={data.label}
          style={{ width: 24, marginRight: 8 }}
        />
      ) : (
        <span style={{ fontSize: 20, marginRight: 8 }}>{data.icon}</span>
      )}
      {data.label}
    </div>
  );
};

const ContactPage = () => {
  const { request } = Operations();
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [cotacts, setContacts] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deletedId, setDeletedId] = useState("");
  const [loading, setloading] = useState("");
  const [loadingPage, setloadingPage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetchServicesData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("is_contact", "1");
    formData.append("photo", photo);

    try {
      let response;
      setloading(true);
      if (selectedService) {
        // تعديل
        response = await request.post(
          `super-admin/updatePage/${selectedService.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          }
        );
      } else {
        // إضافة
        response = await request.post("super-admin/addPage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        });
      }

      console.log("تم الإرسال بنجاح", response.data);
      setPhoto(null);
      setTitle("");
      setDescription("");
      setShowModal(false);
      setSelectedService(null);
      fetchServicesData();
    } catch (err) {
      console.error("فشل في الإرسال:", err);
    } finally {
      setloading(false);
    }
  };
  const fetchServicesData = async () => {
    setloadingPage(true);
    try {
      const res = await request.get("showAllPage?is_contact=1");
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching about data:", err);
    } finally {
      setloadingPage(false);
    }
  };
  const handleDelete = async (id) => {
    setloading(true);
    try {
      await request.delete(`super-admin/destroyPage/${id}`);
      setOpenDelete(false);
      fetchServicesData();
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="contact-wrapper d-flex flex-column align-items-center">
      <button
        className="btn rounded-circle"
        style={{
          position: "fixed",
          bottom: "60px",
          right: "30px",
          width: "60px",
          height: "60px",
          fontSize: "30px",
          backgroundColor: "#1E3A5F",
          borderColor: "#1E3A5F",
          color: "#fff",
          boxShadow: "0 4px 8px #1E3A5F",
          zIndex: 1050,
          border: "none",
        }}
        onClick={() => {
          setShowModal(true);
          setIsNew(true);
        }}
        aria-label="Add Language"
      >
        +
      </button>
      <Container className="contact-page col-10 col-md-7 text-center my-5 p-4 shadow-lg rounded-4">
        <h2 className="mb-3 section-title">Accounts and Numbers</h2>
        <p className="sub-title">طرق التواصل مع المعهد</p>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8}>
            {loadingPage ? (
              <p>Loading...</p>
            ) : (
              <div className="contact-info text-start">
                {cotacts.map((item) => (
                  <div
                    style={{
                      borderBottom: "1px solid #999999",
                      padding: "10px 0",
                    }}
                  >
                    <a
                      href={item.description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-item text-decoration-none"
                    >
                      <span className="service-icon">
                        {iconMap[item.photo] || "❓"}
                      </span>{" "}
                      <span>{item.title}</span>
                    </a>{" "}
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                          setOpenDelete(true);
                          setDeletedId(item.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => {
                          setIsNew(false);
                          setSelectedService(item);
                          setTitle(item.title);
                          setDescription(item.description);
                          setPhoto(item.photo);
                          setShowModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>{isNew ? "Add contact" : "Edit Contact"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Link</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Icon</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isSearchable
                options={iconOptions}
                value={iconOptions.find((opt) => opt.value === photo)}
                onChange={(selected) => setPhoto(selected.value)}
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
              />
            </div>

            <div className="text-end">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#1E3A5F", color: "#fff" }}
              >
                {loading ? "Loading..." : isNew ? "Add" : "Save"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {openDelete && (
        <Confirm
          show={openDelete}
          title="Confirm deletion"
          message={`Are you sure you want to delete this contact?`}
          onSuccess={() => handleDelete(deletedId)}
          onClose={() => setOpenDelete(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ContactPage;
