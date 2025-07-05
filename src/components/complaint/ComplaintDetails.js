import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Operations from "../back_component/Operations";
import { useQuery } from "@tanstack/react-query";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle,
  FaEye,
} from "react-icons/fa";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const { request } = Operations();

  // استقبال دالة التحديث من location.state
  const onComplaintUpdate = location.state?.onComplaintUpdate;

  // دالة لجلب بيانات الشكوى
  const fetchComplaint = async () => {
    const res = await request.get(`super-admin/showComplaint/${id}`);
    return res.data.data;
  };

  // دالة لجلب شكاوى المعلم الأخرى
  const fetchTeacherComplaints = async () => {
    if (!complaint?.teacher?.id) return [];
    const res = await request.get(`teacher/showTeacherOwnComplaints`);
    return res.data.data || [];
  };

  const {
    data: complaint = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["complaint", id],
    queryFn: fetchComplaint,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  // جلب شكاوى المعلم الأخرى
  const { data: teacherComplaints = [], isLoading: teacherComplaintsLoading } =
    useQuery({
      queryKey: ["teacherComplaints", complaint?.teacher?.id],
      queryFn: fetchTeacherComplaints,
      enabled: !!complaint?.teacher?.id,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    });

  // دالة لتأكيد حل الشكوى
  const handleConfirmComplaint = async () => {
    try {
      await request.post(`super-admin/checkComplaint/${id}`);
      setSuccessMessage("Complaint has been marked as resolved successfully.");

      // تحديث البيانات المحلية
      refetch();

      // إخطار المكون الأب بالتحديث
      if (onComplaintUpdate) {
        onComplaintUpdate();
      }

      // إخفاء رسالة النجاح بعد 3 ثواني
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Failed to confirm complaint:", error);
      setSuccessMessage("Failed to update complaint status.");
    }
  };

  // دالة لإظهار الشارة حسب الحالة
  const renderStatusBadge = (status) => {
    const color = status.toLowerCase() === "pending" ? "warning" : "success";
    return <span className={`badge bg-${color} px-3 py-2`}>{status}</span>;
  };

  // تصفية شكاوى المعلم (استبعاد الشكوى الحالية)
  const otherTeacherComplaints = teacherComplaints.filter(
    (complaintItem) => complaintItem.id !== parseInt(id)
  );

  if (isLoading) {
    return <div className="text-center mt-5">Loading complaint...</div>;
  }
  if (isError) {
    return <div className="text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4">
        <h2
          className="text-center mb-4 text-uppercase"
          style={{ letterSpacing: "3px", color: "#FF7F00" }}
        >
          Complaint Details
        </h2>

        {/* رسالة النجاح */}
        {successMessage && (
          <div
            className={`alert ${
              successMessage.includes("Failed")
                ? "alert-danger"
                : "alert-success"
            }`}
            role="alert"
          >
            {successMessage}
          </div>
        )}

        {/* تفاصيل الشكوى */}
        <div className="mb-3">
          <strong>Subject:</strong>
          <p className="form-control bg-light">{complaint.subject}</p>
        </div>
        <div className="mb-3">
          <strong>Teacher Name:</strong>
          <p className="form-control bg-light">{complaint.teacher?.name}</p>
        </div>
        <div className="mb-3">
          <strong>Teacher Email:</strong>
          <p className="form-control bg-light">{complaint.teacher?.email}</p>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <strong>Created At:</strong>
            <p className="form-control bg-light">
              {new Date(complaint.created_at).toLocaleString()}
            </p>
          </div>
          <div className="col-md-6">
            <strong>Updated At:</strong>
            <p className="form-control bg-light">
              {new Date(complaint.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mb-3">
          <strong>Status:</strong> <br />
          {renderStatusBadge(complaint.status)}
        </div>

        {/* زر تأكيد حل الشكوى يظهر فقط إذا كانت الحالة pending */}
        {complaint.status.toLowerCase() === "pending" && (
          <button
            className="btn btn-success mb-3"
            onClick={handleConfirmComplaint}
          >
            Confirm Complaint Resolved
          </button>
        )}

        <hr />

        {/* شكاوى المعلم الأخرى */}
        {otherTeacherComplaints.length > 0 && (
          <div className="mt-4">
            <h4 style={{ color: "#1E3A5F" }}>
              <FaUser className="me-2" />
              Other Complaints from {complaint.teacher?.name}
            </h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th style={{ color: "#1E3A5F" }}>
                      <FaHashtag className="me-2" />#
                    </th>
                    <th style={{ color: "#1E3A5F" }}>
                      <FaInfoCircle className="me-2" />
                      Subject
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {otherTeacherComplaints.map((complaintItem, index) => (
                    <tr key={complaintItem.id}>
                      <td>{index + 1}</td>
                      <td>{complaintItem.subject}</td>
                      <td>
                        {new Date(complaintItem.created_at).toLocaleString()}
                      </td>
                      <td>{renderStatusBadge(complaintItem.status)}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#1E3A5F",
                            borderColor: "#1E3A5F",
                            color: "white",
                            borderRadius: "6px",
                            padding: "6px 12px",
                          }}
                          onClick={() =>
                            navigate(`/complaint-details/${complaintItem.id}`, {
                              state: { onComplaintUpdate },
                            })
                          }
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          className="btn mt-3"
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#1E3A5F",
            borderColor: "#1E3A5F",
            color: "#fff",
            borderRadius: "8px",
            padding: "8px 16px",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#FF7F00";
            e.target.style.borderColor = "#FF7F00";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#1E3A5F";
            e.target.style.borderColor = "#1E3A5F";
          }}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
