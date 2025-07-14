import React, { useEffect, useRef } from "react";
import LanguagesPage from "../languages card/LanguagesPage";
//import './styles/App.css'; // استيراد ملف CSS
import Services from "../services/Services.js";
import About from "../services/About.js";
import HolidaysPage from "../free days/HolidaysPage.js";
import CourseSchedule from "../courses schudle/CourseSchedule.js";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    const heroContent = document.querySelector(".hero-content");
    heroContent.classList.add("slide-in");
  }, []);

  return (
    <div className="home">
      <section className="hero-modern">
        <div className="hero-content">
          <h1 className="hero-welcome">Welcome to LMC</h1>
          <p className="hero-subtext">
            Where Language Meets Ambition
            <br />
            Where Language Inspires Success
            <br />
            Where Words Shape Futures
            <br />
            Where Language Fuels Dreams
            <br />
            Where Expression Drives Excellence
            <br />
            Where Culture Meets Opportunity{" "}
          </p>
        </div>

        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,224C384,224,480,256,576,234.7C672,213,768,139,864,122.7C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default Home;
