import { useEffect, useState } from "react";
import Operations from "../back_component/Operations";
import { Container, Row, Col, Modal } from "react-bootstrap";
import "./Services.css";
import Select from "react-select";
import {
  FaUniversity,
  FaUserTie,
  FaFileAlt,
  FaBookReader,
  FaChalkboardTeacher,
  FaComments,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import Confirm from "../ui/confirmMessage";

// أعلام الدول
const flagOptions = [
  { label: "English", value: "gb", icon: "https://flagcdn.com/w40/gb.png" },
  { label: "German", value: "de", icon: "https://flagcdn.com/w40/de.png" },
  { label: "Dutch", value: "nl", icon: "https://flagcdn.com/w40/nl.png" },
  { label: "French", value: "fr", icon: "https://flagcdn.com/w40/fr.png" },
  { label: "Spanish", value: "es", icon: "https://flagcdn.com/w40/es.png" },
  { label: "Italian", value: "it", icon: "https://flagcdn.com/w40/it.png" },
  { label: "Russian", value: "ru", icon: "https://flagcdn.com/w40/ru.png" },
  { label: "Portuguese", value: "pt", icon: "https://flagcdn.com/w40/pt.png" },
];

// أيقونات الخدمات
const iconOptions = [
  { label: "University", value: "FaUniversity", icon: <FaUniversity /> },
  { label: "Embassy Interview", value: "FaUserTie", icon: <FaUserTie /> },
  { label: "IELTS", value: "FaFileAlt", icon: <FaFileAlt /> },
  { label: "German Models", value: "FaBookReader", icon: <FaBookReader /> },
  {
    label: "Native Teachers",
    value: "FaChalkboardTeacher",
    icon: <FaChalkboardTeacher />,
  },
  { label: "Private Sessions", value: "FaComments", icon: <FaComments /> },
];
const iconMap = {
  FaUniversity: <FaUniversity />,
  FaUserTie: <FaUserTie />,
  FaFileAlt: <FaFileAlt />,
  FaBookReader: <FaBookReader />,
  FaChalkboardTeacher: <FaChalkboardTeacher />,
  FaComments: <FaComments />,
};
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

export default function ServicesManage() {
  const { request } = Operations();
  const [showModal, setShowModal] = useState(false);
  const [allServices, setServices] = useState([]);
  const [formType, setFormType] = useState(null);
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

  const fetchServicesData = async () => {
    setloadingPage(true);
    try {
      const res = await request.get("showAllPage?is_contact=0");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services data:", err);
    } finally {
      setloadingPage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("is_contact", "0");
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
      setFormType(null);
      setSelectedService(null);
      fetchServicesData();
    } catch (err) {
      console.error("فشل في الإرسال:", err);
    } finally {
      setloading(false);
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
  const languages = allServices.filter(
    (item) => item.description === "language"
  );
  const services = allServices.filter(
    (item) => item.description !== "language"
  );

  return (
    <div>
      <div className="services-section">
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
          onClick={() => setShowModal(true)}
          aria-label="Add Language"
        >
          +
        </button>
        <Container>
          <h2 className="section-title text-center">The languages we offer</h2>
          <Row className="justify-content-center">
            {loadingPage ? (
              <p>Loading...</p>
            ) : (
              <Row className="justify-content-center">
                {languages.map((lang, index) => (
                  <Col xs={6} sm={4} md={3} key={index} className="mb-4">
                    <div className="service-card text-center">
                      <img
                        src={`https://flagcdn.com/w40/${lang.photo}.png`}
                        alt={lang.title}
                        className="flag-icon"
                      />
                      <h5>{lang.title}</h5>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => {
                            setOpenDelete(true);
                            setDeletedId(lang.id);
                          }}
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => {
                            setFormType(
                              lang.description === "language"
                                ? "language"
                                : "service"
                            );
                            setSelectedService(lang);
                            setTitle(lang.title);
                            setDescription(lang.description);
                            setPhoto(lang.photo);
                            setShowModal(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Row>

          <h2 className="section-title text-center mt-5">Other services</h2>
          {loadingPage ? (
            <p>Loading...</p>
          ) : (
            <Row className="justify-content-center">
              {services.map((service, index) => (
                <Col xs={12} sm={6} md={4} key={index} className="mb-4">
                  <div className="service-card">
                    <div className=" d-flex align-items-center">
                      <span className="service-icon">
                        {iconMap[service.photo] || "❓"}
                      </span>
                      <span className="service-text">{service.title}</span>
                    </div>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                          setOpenDelete(true);
                          setDeletedId(service.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => {
                          setFormType(
                            service.description === "language"
                              ? "language"
                              : "service"
                          );
                          setSelectedService(service);
                          setTitle(service.title);
                          setDescription(service.description);
                          setPhoto(service.photo);
                          setShowModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
        <Modal
          show={showModal && !formType}
          onHide={() => {
            setFormType(null);
            setShowModal(false);
            setSelectedService(null);
          }}
          centered
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1E3A5F", color: "white" }}
          >
            <Modal.Title>Choose Type</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <button
              className="btn btn-primary m-2"
              onClick={() => {
                setFormType("language");
                setDescription("language");
              }}
            >
              Add Language
            </button>
            <button
              className="btn btn-warning m-2"
              onClick={() => {
                setFormType("service");
              }}
            >
              Add General Service
            </button>
          </Modal.Body>
        </Modal>
        <Modal
          show={!!formType}
          onHide={() => {
            setFormType(null);
            setShowModal(false);
          }}
          centered
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1E3A5F", color: "white" }}
          >
            <Modal.Title>
              {formType === "language" ? "Add Language" : "Add Service"}
            </Modal.Title>
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

              {formType !== "language" && (
                <div className="mb-3">
                  <label>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label>Icon</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable
                  options={formType === "language" ? flagOptions : iconOptions}
                  value={
                    formType === "language"
                      ? flagOptions.find((opt) => opt.value === photo)
                      : iconOptions.find((opt) => opt.value === photo)
                  }
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
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        {openDelete && (
          <Confirm
            show={openDelete}
            title="Confirm deletion"
            message={`Are you sure you want to delete this ${
              formType === "language" ? "language" : "service"
            } ?`}
            onSuccess={() => handleDelete(deletedId)}
            onClose={() => setOpenDelete(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
