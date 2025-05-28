import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";


const languages = [
  { name: "English", flag: "🇬🇧" },
  { name: "French", flag: "🇫🇷" },
  { name: "Dutch", flag: "🇳🇱" },
  { name: "German", flag: "🇩🇪" },
  { name: "Spanish", flag: "🇪🇸" },
  { name: "Italian", flag: "🇮🇹" },
  { name: "Russian", flag: "🇷🇺" },
  { name: "Portuguese", flag: "🇵🇹" },
];

const LanguagesPage = () => {
  return (
    <section className="languages-section">
      <h2 className="section-title">Languages We Offer</h2>
      <div className="language-grid">
        {languages.map((lang, index) => (
          <div className="language-card" key={index}>
            <div className="flag">{lang.flag}</div>
            <h3 className="language-name">{lang.name}</h3>
            <button className="details-button">View Details</button>
          </div>
        ))}
      </div>
    </section>
  );
};


export default LanguagesPage;
