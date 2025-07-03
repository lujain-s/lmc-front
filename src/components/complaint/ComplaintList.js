import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Operations from "../back_component/Operations";
import { useQuery } from "@tanstack/react-query";
import {
  FaHashtag,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle,
  FaEye,
} from "react-icons/fa";

export default function ComplaintList() {
  const { request } = Operations();
  const [fillter, setFillter] = useState("showAllComplaint");

  const fetchData = async () => {
    const res = await request.get(`super-admin/${fillter}`);
    return res.data.data;
  };

  const {
    data: complaints = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["complaints", fillter],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleSearch = () => {
      const value = document
        .getElementById("complaintSearch")
        .value.toLowerCase();
      const rows = document.querySelectorAll("#complaintTable tr");
      rows.forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(value)
          ? ""
          : "none";
      });
    };

    const input = document.getElementById("complaintSearch");
    if (input) input.addEventListener("keyup", handleSearch);
    return () => {
      if (input) input.removeEventListener("keyup", handleSearch);
    };
  }, []);

  const renderStatusBadge = (status) => {
    const color = status.toLowerCase() === "pending" ? "warning" : "success";
    return <span className={`badge bg-${color}`}>{status}</span>;
  };

  return (
    <div className="pt-5 pb-5 mt-5">
      <h1
        className="text-center text-uppercase"
        style={{ letterSpacing: "5px", color: "#FF7F00", fontWeight: 700 }}
      >
        Complaint List
      </h1>
      <br />
      <div className="container">
        <p className="text-center">
          Type something in the input field to filter the table data, e.g. type
          (Teacher Name) in search field...
        </p>

        <input
          className="form-control"
          id="complaintSearch"
          type="text"
          placeholder="Search ..."
        />
        <br />
        <div className="table-responsive card2 p-0 container mt-4">
          <div className="flex gap-2" style={{ marginBottom: 18 }}>
            <button
              className={
                fillter === "showAllComplaint" ? "button-orange" : "button-blue"
              }
              onClick={() => setFillter("showAllComplaint")}
            >
              All
            </button>
            <button
              className={
                fillter === "showPendingComplaints"
                  ? "button-orange mx-2"
                  : "button-blue mx-2"
              }
              onClick={() => setFillter("showPendingComplaints")}
            >
              Pending
            </button>
            <button
              className={
                fillter === "showSolvedComplaints"
                  ? "button-orange"
                  : "button-blue"
              }
              onClick={() => setFillter("showSolvedComplaints")}
            >
              Solved
            </button>
          </div>
          <table className="table mb-0 table-bordered table-striped">
            <thead>
              <tr>
                <th style={{ color: "#1E3A5F" }}>
                  <FaHashtag className="me-2" />#
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaUser className="me-2" />
                  Teacher Name
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaEnvelope className="me-2" />
                  Teacher Email
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaCalendarAlt className="me-2" />
                  Date
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaInfoCircle className="me-2" />
                  Status
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaEye className="me-2" />
                  Details
                </th>
              </tr>
            </thead>
            <tbody id="complaintTable">
              {complaints.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.teacher?.name}</td>
                  <td>{item.teacher?.email}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td>{renderStatusBadge(item.status)}</td>
                  <td>
                    <Link
                      to={`/complaint-details/${item.id}`}
                      className="button-blue"
                      style={{
                        padding: "4px 14px",
                        borderRadius: "4px",
                        fontWeight: 600,
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <style>
            {`
              .button-blue {
                background-color: #1E3A5F;
                border: none;
                color: #fff;
                font-weight: bold;
                border-radius: 8px;
                padding: 6px 18px;
                transition: background 0.2s;
              }
              .button-blue:hover,
              .button-blue:focus,
              .button-orange:hover,
              .button-orange:focus {
                border: none !important;
              }
              input.form-control:focus,
              select.form-control:focus,
              textarea.form-control:focus {
                border-color: #FF7F00 !important;
                box-shadow: 0 0 8px #FF7F00 !important;
                outline: none;
              }
              .button-blue,
              .button-orange {
                border-radius: 8px !important;
              }
              `}
          </style>
        </div>
      </div>
    </div>
  );
}
