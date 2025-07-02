import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import AddHolidayPage from "./AddHolidayPage";
import Operations from "../back_component/Operations";
import { GiPartyPopper } from "react-icons/gi";
import { useQuery } from "@tanstack/react-query";

const HolidaysPage = () => {
  const { request } = Operations();
  const [showModal, setShowModal] = useState(false);

  const fetchHolidays = async () => {
    try {
      const response = await request.get("getHoliday");
      if (response.data.status === "success") {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };
  //data from react quiry after fetch
  const {
    data: holidays = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["holidays"],
    queryFn: fetchHolidays,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center bg-light pt-5">
      <h1
        className="text-center text-uppercase gap-2 pt-1 pb-5 mt-5"
        style={{
          letterSpacing: "5px",
          color: "#FF7F00",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        LMC HOLIDAYS
      </h1>

      <div className="row w-100">
        {holidays.map(({ id, Name, StartDate, EndDate, Description }) => (
          <div key={id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm text-center p-3 h-100">
              <GiPartyPopper
                style={{ color: "#FF7F00", fontSize: "50px" }}
                className="display-5 "
              />
              <h5 className="fw-bold">{Name}</h5>
              <p className="text-muted mb-1">
                {StartDate} ➜ {EndDate}
              </p>
              {Description && (
                <small className="text-secondary">{Description}</small>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* زر الإضافة */}
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
        aria-label="Add Holiday"
      >
        +
      </button>

      {/* مودال إضافة عطلة */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Add New Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddHolidayPage
            onSuccess={() => refetch}
            onClose={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* أنماط الزر والمدخلات */}
      <style>{`
        .custom-btn {
          background-color: #1E3A5F;
          border-color: #1E3A5F;
          color: white;
        }
        .custom-btn:hover,
        .custom-btn:focus {
          background-color: #FF7F00 !important;
          border-color: #FF7F00 !important;
          color: white;
        }
        input.form-control:focus,
        select.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default HolidaysPage;
