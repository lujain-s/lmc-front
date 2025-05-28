import React from "react";
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

const languages = [
  { name: "English", flag: "gb" },
  { name: "German", flag: "de" },
  { name: "Dutch", flag: "nl" },
  { name: "French", flag: "fr" },
  { name: "Spanish", flag: "es" },
  { name: "Italian", flag: "it" },
  { name: "Russian", flag: "ru" },
  { name: "Portuguese", flag: "pt" },
];

const otherServices = [
  { icon: <FaUniversity />, text: "تأمين قبول جامعي" },
  { icon: <FaUserTie />, text: "تحضير لمقابلات السفارة" },
  { icon: <FaFileAlt />, text: "IELTS تحضير لاختبار " },
  { icon: <FaBookReader />, text: " (Goethe / ÖSD) نماذج ألماني " },
  { icon: <FaChalkboardTeacher />, text: "مدرسين ناطقين أصليين للغة" },
  { icon: <FaComments />, text: "Private جلسات فردية " },
];

const Services = () => {
  return (
    <div className="services-section">
      <Container>
        <h2 className="section-title text-center">The languages we offer</h2>
        <Row className="justify-content-center">
          {languages.map((lang, index) => (
            <Col xs={6} sm={4} md={3} key={index} className="mb-4">
              <div className="service-card text-center">
                <img
                  src={`https://flagcdn.com/w40/${lang.flag}.png`}
                  alt={lang.name}
                  className="flag-icon"
                />
                <h5>{lang.name}</h5>
              </div>
            </Col>
          ))}
        </Row>

        <h2 className="section-title text-center mt-5">Other services</h2>
        <Row className="justify-content-center">
          {otherServices.map((service, index) => (
            <Col xs={12} sm={6} md={4} key={index} className="mb-4">
              <div className="service-card d-flex align-items-center">
                <span className="service-icon">{service.icon}</span>
                <span className="service-text">{service.text}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Services;
