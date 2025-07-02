import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Operations from "../back_component/Operations";

export default function AddStudent({ onSubmit, onClose, id }) {
  const [students, setStudents] = useState([]);
  const [studentType, setStudentsType] = useState("");
  const [student, setStudent] = useState({
    StudentId: "",
    isPrivate: 0,
    CourseId: id || "",
  });
  const [loading, setLoading] = useState(false);
  const { request } = Operations();

  const fetchStudents = async () => {
    try {
      const res = await request.get(
        `secretarya/getGuestStudent${studentType ? `?type=${studentType}` : ""}`
      );

      const students = res.data.students || [];
      const guests = res.data.guests || [];

      let mergedUsers = [];

      if (studentType === "student") {
        mergedUsers = students;
      } else if (studentType === "guest") {
        mergedUsers = guests;
      } else {
        // all
        mergedUsers = [...students, ...guests];
      }

      setStudents(mergedUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [studentType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setStudent((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await request.post("secretarya/enroll", student);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    onSubmit(student);
    setLoading(false);
    onClose();
  };

  return (
    <Form style={{ color: "#1E3A5F" }} onSubmit={handleSubmit} noValidate>
      <div className="mb-3 text-start">
        <label className="form-label">user type</label>
        <select
          name="StudentId"
          className="form-control"
          value={studentType}
          onChange={(e) => setStudentsType(e.target.value)}
        >
          <option value="">-- user type --</option>
          <option value={""}>All</option>
          <option value={"student"}>Student</option>
          <option value={"guest"}>Guest</option>
        </select>
      </div>
      <div className="mb-3 text-start">
        <label className="form-label">Select Student</label>
        <select
          name="StudentId"
          className="form-control"
          value={student.StudentId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a Student --</option>
          {students.map((studentItem) => (
            <option key={studentItem.id} value={studentItem.id}>
              {studentItem.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 form-check text-start">
        <input
          type="checkbox"
          className="form-check-input"
          id="isPrivate"
          name="isPrivate"
          checked={student.isPrivate === 1}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="isPrivate">
          Private Enrollment?
        </label>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          style={{
            backgroundColor: "#1E3A5F",
            borderColor: "#1E3A5F",
            borderWidth: "2px",
            borderStyle: "solid",
            transition: "background-color 0.3s ease, border-color 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#FF7F00";
            e.currentTarget.style.borderColor = "#FF7F00";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#1E3A5F";
            e.currentTarget.style.borderColor = "#1E3A5F";
          }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Student"}
        </Button>
      </div>
    </Form>
  );
}
