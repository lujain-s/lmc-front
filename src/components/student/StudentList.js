import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import AddStudent from "./AddStudent";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات الطلاب الابتدائية (يمكن استبدالها ببيانات من API)
  const studentData = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "********",
      accountCreated: "2023-01-01",
      id: 1,
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "********",
      accountCreated: "2023-02-15",
      id: 2,
    },
    {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      password: "********",
      accountCreated: "2023-03-30",
      id: 3,
    },
    {
      name: "Emily White",
      email: "emily.white@example.com",
      password: "********",
      accountCreated: "2023-04-12",
      id: 4,
    },
  ];

  useEffect(() => {
    setStudents(studentData);
  }, []);

  const handleAddStudent = (newStudent) => {
    // إضافة معرف تلقائي للطالب الجديد
    const newId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    setStudents((prev) => [...prev, { ...newStudent, id: newId }]);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-5 pb-5 mt-5 container">
      <h1 className="text-center text-uppercase mb-4" style={{ letterSpacing: "5px", color: "#FF7F00" }}>
        Student Information
      </h1>

      <p className="text-center">
        Type something in the input field to filter the table data, e.g. type (student name) in search field...
      </p>

      <input
        className="form-control mb-4"
        type="text"
        placeholder="Search by student name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-responsive card2 p-0 container mt-4 p-5">
        <table className="table mb-0 m-0 table-bordered table-striped">
          <thead>
            <tr>
              <th style={{ color: "#1E3A5F" }}>#</th>
              <th style={{ color: "#1E3A5F" }}>Student Name</th>
              <th style={{ color: "#1E3A5F" }}>Email</th>
              <th style={{ color: "#1E3A5F" }}>Account Created</th>
              <th style={{ color: "#1E3A5F" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id} style={{ transition: "all 0.3s ease" }}>
                <td>{index + 1}</td>
                <td>
                  <h6 style={{ marginBottom: "5px" }}>{student.name}</h6>
                  <p style={{ marginBottom: 0, fontWeight: "bold", color: "#007bff" }}>{student.email}</p>
                </td>
                <td>********</td>
                <td>
                  <h6 className="text-center">{student.accountCreated}</h6>
                </td>
                <td>
                  <Link
                    to={`/student-details/${student.id}`}
                    className="btn btn-info"
                    style={{
                      backgroundColor: "#1E3A5F",
                      borderColor: "#1E3A5F",
                      padding: "4px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* زر عائم لإضافة طالب */}
      <button
        className="btn rounded-circle"
        style={{
          position: "fixed",
          bottom: "60px",
          right: "30px",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          backgroundColor: "#1E3A5F",
          borderColor: "#1E3A5F",
          color: "#fff",
          boxShadow: "0 4px 8px #1E3A5F",
          zIndex: 1000,
          border: "none"
        }}
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {/* مودال إضافة طالب */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" scrollable>
        <Modal.Header closeButton style={{ backgroundColor: "#1E3A5F", color: "white" }}>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f9f9f9" }}>
          <AddStudent
            onSubmit={handleAddStudent}
            onClose={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
      <style>
        {`
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
