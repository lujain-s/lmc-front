import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { QueryClient, useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import Confirm from "../ui/confirmMessage";
import "../../styles/colors.css";
import {
  FaHashtag,
  FaBook,
  FaUser,
  FaClock,
  FaCalendar,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaEye,
  FaEnvelope,
} from "react-icons/fa";

export default function IndividualCourseRequests() {
  const { request } = Operations();

  const [showModal, setShowModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [responseData, setResponseData] = useState({
    status: "",
    message: "",
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal("viewDetails");
  };

  const handleRespond = (requestId) => {
    setActionId(requestId);
    setShowModal("respond");
  };

  const fetchRequests = async () => {
    try {
      const res = await request.get("secretarya/showAllIndividualRequest");
      console.log("Fetched requests:", res.data);
      return res.data || [];
    } catch (err) {
      console.error("Error fetching requests:", err);
      return [];
    }
  };

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["individualRequests"],
    queryFn: fetchRequests,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 0, // إزالة التخزين المؤقت لضمان جلب البيانات المحدثة
  });

  // دالة مساعدة لجلب البيانات المحدثة
  const refreshData = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleResponseSubmit = async () => {
    if (!responseData.status) {
      alert("Please select a status");
      return;
    }

    setLoading(true);
    try {
      await request.post(
        `secretarya/respondToRequestIndividualCourse/${actionId}`,
        {
          response: responseData.status, // إذا كان المطلوب نص حر استخدم responseData.message
        }
      );
      setShowModal("");
      setResponseData({ status: "", message: "" });
      // جلب البيانات المحدثة فوراً
      await refreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests =
    searchTerm.trim() === ""
      ? requests
      : requests.filter((req) => {
          const search = searchTerm.toLowerCase();
          const studentName = req.student?.name?.toLowerCase() || "";
          const studentEmail = req.student?.email?.toLowerCase() || "";
          const courseName = req.course?.language?.Name?.toLowerCase() || "";
          const status = req.status?.toLowerCase() || "";

          return (
            studentName.includes(search) ||
            studentEmail.includes(search) ||
            courseName.includes(search) ||
            status.includes(search)
          );
        });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", text: "Pending" },
      approved: { class: "bg-success", text: "Approved" },
      rejected: { class: "bg-danger", text: "Rejected" },
    };

    const config = statusConfig[status.toLowerCase()] || {
      class: "bg-secondary",
      text: status,
    };

    return (
      <span className={`badge ${config.class}`} style={{ fontSize: "12px" }}>
        {config.text}
      </span>
    );
  };

  const RequestItems = () => {
    if (filteredRequests.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center">
            No requests found
          </td>
        </tr>
      );
    }

    return filteredRequests.map((request, index) => (
      <tr key={request.id}>
        <td>{index + 1}</td>
        <td>
          <div>
            <strong>{request.student?.name || "Unknown"}</strong>
            <br />
            <small className="text-muted">
              {request.student?.email || "No email"}
            </small>
          </div>
        </td>
        <td>{request.course?.language?.Name || "Unknown Course"}</td>
        <td>{getStatusBadge(request.status)}</td>
        <td>
          {request.created_at
            ? new Date(request.created_at).toLocaleDateString()
            : "—"}
        </td>
        <td>
          {request.updated_at
            ? new Date(request.updated_at).toLocaleDateString()
            : "—"}
        </td>
        <td>
          <button
            className="button-blue me-1"
            style={{ padding: "4px 12px", fontSize: 18 }}
            onClick={() => handleViewDetails(request)}
          >
            <FaEye />
          </button>
          {request.status === "Pending" && (
            <button
              className="button-orange me-1"
              style={{ padding: "4px 12px", fontSize: 18 }}
              onClick={() => handleRespond(request.id)}
            >
              <FaCheck />
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="pt-5 pb-5 mt-5">
        <h1
          className="text-center text-uppercase"
          style={{ letterSpacing: "5px", color: "#FF7F00", fontWeight: 700 }}
        >
          Individual Course Requests
        </h1>
        <br />
        <div className="container">
          <p className="text-center">
            Type something in the input field to filter the table data, e.g.
            type (student name, course name, or status) in search field...
          </p>
          <input
            className="form-control package-item mb-0"
            id="requestSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search..."
          />
          <br />

          <div className="table-responsive card2 p-0 container mt-4">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>
                    <FaHashtag className="me-2" />#
                  </th>
                  <th>
                    <FaUser className="me-2" />
                    Student
                  </th>
                  <th>
                    <FaBook className="me-2" />
                    Course
                  </th>
                  <th>
                    <FaInfoCircle className="me-2" />
                    Status
                  </th>
                  <th>
                    <FaCalendar className="me-2" />
                    Request Date
                  </th>
                  <th>
                    <FaClock className="me-2" />
                    Updated Date
                  </th>
                  <th>
                    <FaInfoCircle className="me-2" />
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <RequestItems />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal لعرض تفاصيل الطلب */}
      <Modal
        show={showModal === "viewDetails"}
        onHide={() => setShowModal("")}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f9f9f9" }}>
          {selectedRequest && (
            <div className="row">
              <div className="col-md-6">
                <h5 style={{ color: "#1E3A5F" }}>Student Information</h5>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedRequest.student?.name || "Unknown"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedRequest.student?.email || "Unknown"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedRequest.student?.phone || "Not provided"}
                </p>
              </div>
              <div className="col-md-6">
                <h5 style={{ color: "#1E3A5F" }}>Course Information</h5>
                <p>
                  <strong>Course:</strong>{" "}
                  {selectedRequest.course?.language?.Name || "Unknown"}
                </p>
                <p>
                  <strong>Level:</strong>{" "}
                  {selectedRequest.course?.Level || "Not specified"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedRequest.course?.Description || "No description"}
                </p>
              </div>
              <div className="col-12 mt-3">
                <h5 style={{ color: "#1E3A5F" }}>Request Information</h5>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(selectedRequest.status)}
                </p>
                <p>
                  <strong>Request Date:</strong>{" "}
                  {selectedRequest.created_at
                    ? new Date(selectedRequest.created_at).toLocaleString()
                    : "Unknown"}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {selectedRequest.updated_at
                    ? new Date(selectedRequest.updated_at).toLocaleString()
                    : "Unknown"}
                </p>
                {selectedRequest.message && (
                  <p>
                    <strong>Message:</strong> {selectedRequest.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal للرد على الطلب */}
      <Modal
        show={showModal === "respond"}
        onHide={() => {
          setShowModal("");
          setResponseData({ status: "", message: "" });
        }}
        size="md"
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Respond to Request</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f9f9f9" }}>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={responseData.status}
              onChange={(e) =>
                setResponseData({ ...responseData, status: e.target.value })
              }
              required
            >
              <option value="">Select Status</option>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Message (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              value={responseData.message}
              onChange={(e) =>
                setResponseData({ ...responseData, message: e.target.value })
              }
              placeholder="Add a message to the student..."
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal("")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleResponseSubmit}
              disabled={loading}
              style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
            >
              {loading ? "Submitting..." : "Submit Response"}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <style>
        {`
          th, td {
            color: #1E3A5F !important;
          }
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
          .button-blue:focus {
            background-color: #FF7F00 !important;
            color: #fff !important;
            border: none !important;
          }
          .button-orange {
            background-color: #FF7F00;
            border: none;
            color: #fff;
            font-weight: bold;
            border-radius: 8px;
            padding: 6px 18px;
            transition: background 0.2s;
          }
          .button-orange:hover,
          .button-orange:focus {
            background-color: #1E3A5F !important;
            color: #fff !important;
            border: none !important;
          }
          .button-blue svg,
          .button-orange svg {
            color: #fff !important;
            transition: color 0.2s;
          }
          .button-blue:hover svg,
          .button-blue:focus svg,
          .button-orange:hover svg,
          .button-orange:focus svg {
            color: #fff !important;
          }
          input.form-control:focus,
          select.form-control:focus,
          textarea.form-control:focus {
            border-color: #FF7F00 !important;
            box-shadow: 0 0 8px #FF7F00 !important;
            outline: none;
          }
        `}
      </style>
    </div>
  );
}
