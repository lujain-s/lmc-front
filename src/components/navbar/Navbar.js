import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaConciergeBell,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Navbar.css";
import logo from "../../assets/img/logo.jpg";
import Operations from "../back_component/Operations";

const Navbar = () => {
  const { logout, getUser } = Operations();

  const menuItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/about", icon: <FaInfoCircle />, label: "About" },
    { path: "/services", icon: <FaConciergeBell />, label: "Services" },
    { path: "/contact", icon: <FaPhone />, label: "Contact" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container-fluid">
          <div className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo" />
            <h2 className="ms-2 logo-text">LMC</h2>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {getUser() && (
                <li className="nav-item">
                  <Link
                    onClick={logout}
                    className="nav-link d-flex align-items-center"
                  >
                    <FaSignOutAlt /> <span className="ms-1">Logout</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="navbar-placeholder"></div>
    </>
  );
};

export default Navbar;
