import { useState, useEffect } from "react";
import $ from "jquery";
import studentImg from "../../assets/img/img4.jpg";
import { FaUserGraduate, FaCalendarAlt, FaStar } from "react-icons/fa";

const studentGrades = [
  { id: 1, name: "John Doe", date: "2025-03-10", grade: 85 },
  { id: 2, name: "Alice Smith", date: "2025-03-11", grade: 90 },
  { id: 3, name: "Michael Johnson", date: "2025-03-12", grade: 78 },
  { id: 4, name: "Emily Davis", date: "2025-03-13", grade: 92 },
  { id: 5, name: "William Brown", date: "2025-03-14", grade: 88 },
];

export default function StudentGradesPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setStudents(studentGrades);

    // Search filter functionality
    $("#searchInput").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#studentsTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  }, []);
  return (
    <div className="pt-5 pb-5 mt-5">
      <h1 className="text-center text-uppercase" style={{ letterSpacing: "5px", color: "#FF7F00" , marginBottom: "30px"}}>
        Student Grades
      </h1>

      <div className="container">
        <p className="text-center" style={{ marginTop: "20px" }}>
          Type something in the input field to filter the table data, e.g. type (Student name) in search field...
        </p>
        <input
          className="form-control package-item mb-0"
          id="searchInput"
          type="text"
          placeholder="Search students..."
        />
        <br />

        <div className="table-responsive card2 p-0 container mt-4 p-5 shadow-lg rounded" style={{ backgroundColor: "#fff" }}>
          <table className="table mb-0 table-bordered table-striped text-center">
            <thead>
              <tr>
                <th style={{ color: "#1E3A5F" }}>#</th>
                <th style={{ color: "#1E3A5F" }}>
                  Student <FaUserGraduate className="me-2" />
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  Date <FaCalendarAlt className="me-2" />
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  Grade <FaStar className="me-2" />
                </th>
              </tr>
            </thead>
            <tbody id="studentsTable">
              {students.map((student, index) => (
                <tr key={student.id} className="border-b hover:bg-gray-100 transition-all">
                  <td>{index + 1}</td>
                  <td className="text-start ps-4 fw-bold">{student.name}</td>
                  <td>{student.date}</td>
                  <td className="text-blue-600 fw-bold">{student.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>
        {`
          input.form-control:focus,
          select.form-control:focus,
          textarea.form-control:focus {
            border-color: #FF7F00 !important;
            box-shadow: 0 0 8px #FF7F00 !important;
            outline: none;
          }

          .card2 {
            background-color: #ffffff;
            border-radius: 12px;
          }
        `}
      </style>
    </div>
  );

}
