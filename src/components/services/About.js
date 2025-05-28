import '../../styles/colors.css';
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./About.css";
import img4 from "../../assets/img/img4.jpg";
import { FaMapMarkerAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="about-image-col text-center mb-4 mb-md-0">
            <img src={img4}  className="about-image shadow" />
          </Col>
          <Col md={6} className="about-text">
            <div className="about-card">
              <h2 className="section-title mb-3">Discover Language Mastery Center</h2>
              <p className="about-description">
                مركز الإتقان اللغوي هو مركز متخصص في تعليم اللغات، ويقدم خدمات متكاملة في مجال الامتحانات الدولية، القبولات الجامعية، والاستشارات الخاصة بالسفر والدراسة بالخارج
              </p>
              <div className="about-location mt-4">
                <FaMapMarkerAlt className="me-2" />
                <a
                  href="https://www.google.com/maps/place/Language+Mastery+Center/@33.4890102,36.3438096,17z/data=!3m1!4b1!4m6!3m5!1s0x1518e10067fbeef9:0xf7c00280f3fa92a7!8m2!3d33.4890102!4d36.3438096!16s%2Fg%2F11vqhwwwp9?entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
                   target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                >
                  دمشق - جرمانا - حي الروضة
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
