import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaUniversity,
  FaUserTie,
  FaFileAlt,
  FaChalkboardTeacher,
  FaComments,
  FaBookReader,
} from "react-icons/fa";
import "./Services.css";
import Operations from "../back_component/Operations";

const iconMap = {
  FaUniversity: <FaUniversity />,
  FaUserTie: <FaUserTie />,
  FaFileAlt: <FaFileAlt />,
  FaBookReader: <FaBookReader />,
  FaChalkboardTeacher: <FaChalkboardTeacher />,
  FaComments: <FaComments />,
};

const Services = () => {
  const [allServices, setServices] = useState([]);
  const { request } = Operations();
  const [loadingPage, setloadingPage] = useState("");

  const fetchServicesData = async () => {
    setloadingPage(true);
    try {
      const res = await request.get("showAllPage?is_contact=0");
      console.log(res.data);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching about data:", err);
    } finally {
      setloadingPage(false);
    }
  };
  useEffect(() => {
    fetchServicesData();
  }, []);

  const languages = allServices.filter(
    (item) => item.description === "language"
  );
  const services = allServices.filter(
    (item) => item.description !== "language"
  );
  return (
    <div className="services-section">
      <Container>
        <h2 className="section-title text-center">The languages we offer</h2>
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
                </div>
              </Col>
            ))}
          </Row>
        )}

        <h2 className="section-title text-center mt-5">Other services</h2>
        {loadingPage ? (
          <p>Loading...</p>
        ) : (
          <Row className="justify-content-center">
            {services.map((service, index) => (
              <Col xs={12} sm={6} md={4} key={index} className="mb-4">
                <div className="service-card d-flex align-items-center">
                  <span className="service-icon">
                    {iconMap[service.photo] || "❓"}
                  </span>
                  <span className="service-text">{service.title}</span>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Services;
