import '../../styles/colors.css';
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaEnvelope, FaWhatsapp, FaPhone } from "react-icons/fa";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-wrapper d-flex flex-column align-items-center">
      <Container className="contact-page col-10 col-md-7 text-center my-5 p-4 shadow-lg rounded-4">
        <h2 className="mb-3 section-title">Accounts and Numbers</h2>
        <p className="sub-title">طرق التواصل مع المعهد</p>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8}>
            <div className="contact-info text-start">

              <a
                href="https://www.facebook.com/languagemasterycenter"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item text-decoration-none"
              >
                <FaFacebookF className="icon" />
                <span>Language Mastery Center</span>
              </a>

              <a
                href="https://www.instagram.com/language_mastery_center"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item text-decoration-none"
              >
                <FaInstagram className="icon" />
                <span>Language_Mastery_Center</span>
              </a>

              <a
                href="mailto:languagemasterycenter@gmail.com"
                className="contact-item text-decoration-none"
              >
                <FaEnvelope className="icon" />
                <span>languagemasterycenter@gmail.com</span>
              </a>

              <a
                href="https://wa.me/963981319397"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item text-decoration-none"
              >
                <FaWhatsapp className="icon" />
                <span>+963 981 319 397</span>
              </a>

              <a
                href="tel:0115622953"
                className="contact-item text-decoration-none"
              >
                <FaPhone className="icon" />
                <span>011 562 2953</span>
              </a>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
