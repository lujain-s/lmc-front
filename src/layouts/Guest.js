import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Home from "../components/home/Home";
import Services from "../components/services/Services.js";
import ContactPage from "../components/contact/ContactPage.js";
import Login from "../components/login/Login.js";
import About from "../components/services/About.js";
import Footer from "../components/footer/footer.js";
import "./Home.css";
function Guest() {
  return (
    <div className="d-flex">
      <div className="content-container  flex-grow-1">
        <Navbar />
        <div className="container main text-center mt-5 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            holidays
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Guest;
