import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import AddStudent from "./AddStudent";
import { useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import Confirm from "../ui/confirmMessage";
import { FaHashtag, FaUser, FaEnvelope, FaCogs } from "react-icons/fa";

export default function StudentList({ id, start, showAllStudents = false }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionId, setActionId] = useState("");
  const [loading, setLoading] = useState(false);
  const { request } = Operations();

  const fetchStudents = async () => {
    try {
      let res;
      if (showAllStudents) {
        // جلب جميع الطلاب المسجلين
        res = await request.get("secretarya/getAllEnrolledStudents");
        return res.data;
      } else {
        // جلب الطلاب في كورس معين
        res = await request.get(
          `secretarya/viewEnrolledStudentsInCourse/${id}`
        );
        return res.data;
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const isStarted = new Date(start) <= new Date();

  const handleUnrollment = async () => {
    const data = {
      StudentId: actionId,
      CourseId: id,
    };
    setLoading(true);
    try {
      await request.post("secretarya/cancelEnrollment", data);
      setConfirmOpen(false); // إغلاق نافذة التأكيد بعد النجاح
      refetch(); // إعادة جلب بيانات الطلاب
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const {
    data: students = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: showAllStudents ? ["allStudents"] : ["students", id],
    enabled: showAllStudents ? true : !!id,
    queryFn: fetchStudents,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const handleAddStudent = () => {
    refetch();
  };

  const filteredStudents = students.filter((s) => {
    const studentName = showAllStudents
      ? s.Student?.name || s.name || ""
      : s.Student?.name || "";
    return studentName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStudentName = (student) => {
    if (showAllStudents) {
      return student.Student?.name || student.name || "Unknown";
    }
    return student.Student?.name || "Unknown";
  };

  const getStudentEmail = (student) => {
    if (showAllStudents) {
      return student.Student?.email || student.email || "Unknown";
    }
    return student.Student?.email || "Unknown";
  };

  const getStudentId = (student) => {
    if (showAllStudents) {
      return student.Student?.id || student.id || student.EnrollmentId;
    }
    return student.Student?.id || student.EnrollmentId;
  };

  return (
    <div className="pt-5 pb-5 mt-5 container">
      <h1
        className="text-center text-uppercase mb-4"
        style={{ letterSpacing: "5px", color: "#FF7F00", fontWeight: 700 }}
      >
        {showAllStudents ? "All Enrolled Students" : "Student Information"}
      </h1>

      <p className="text-center">
        Type something in the input field to filter the table data, e.g. type
        (student name) in search field...
      </p>

      <input
        className="form-control mb-4"
        type="text"
        placeholder="Search by student name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-responsive card2 p-0 mt-4">
        <div
          className="w-100"
          style={{ border: "1px solid #dee2e6", borderBottom: "none" }}
        >
          <div className="d-flex justify-content-between align-items-center  px-4 py-2">
            <h3 className="m-0" style={{ color: "#1E3A5F" }}>
              <FaUser className="me-2" />
              {showAllStudents ? "All Students List" : "Student List"}
            </h3>
            <button className="button-blue" onClick={() => setShowModal(true)}>
              + <FaUser />
            </button>
          </div>
        </div>

        <table className="table mb-0 table-bordered table-striped">
          <thead>
            <tr>
              <th style={{ color: "#1E3A5F" }}>
                <FaHashtag className="me-2" />#
              </th>
              <th style={{ color: "#1E3A5F" }}>
                <FaUser className="me-2" />
                Student Name
              </th>
              <th style={{ color: "#1E3A5F" }}>
                <FaEnvelope className="me-2" />
                Email
              </th>
              {!showAllStudents && (
                <th style={{ color: "#1E3A5F" }}>
                  <FaCogs className="me-2" />
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={getStudentId(student)}>
                <td>{index + 1}</td>
                <td>
                  <h6 style={{ marginBottom: "5px" }}>
                    {getStudentName(student)}
                  </h6>
                </td>
                <td>
                  <p
                    style={{
                      marginBottom: 0,
                      fontWeight: "bold",
                      color: "#007bff",
                    }}
                  >
                    {getStudentEmail(student)}
                  </p>
                </td>
                {!showAllStudents && (
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setConfirmOpen(true);
                        setActionId(getStudentId(student));
                      }}
                      disabled={isStarted || loading}
                    >
                      Cancel
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {isLoading && <tr>Loading...</tr>}
            {isError && <tr>{error.message}</tr>}
          </tbody>
        </table>
      </div>

      {/* مودال إضافة طالب */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        scrollable
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f9f9f9" }}>
          <AddStudent
            onSubmit={handleAddStudent}
            onClose={() => setShowModal(false)}
            id={id}
            showAllStudents={showAllStudents}
          />
        </Modal.Body>
      </Modal>

      {/* مودال تأكيد إلغاء التسجيل - يظهر فقط عند عرض طلاب كورس معين */}
      {!showAllStudents && (
        <Confirm
          show={confirmOpen}
          buttonText="Unenroll Student"
          title="Confirm Unenrollment"
          message="Are you sure you want to cancel Enrollment this student?"
          onSuccess={() => handleUnrollment()}
          onClose={() => setConfirmOpen(false)}
          loading={loading}
        />
      )}

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
          .button-blue:focus {
            background-color: #FF7F00 !important;
            color: #fff !important;
          }
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
        `}
      </style>
    </div>
  );
}
