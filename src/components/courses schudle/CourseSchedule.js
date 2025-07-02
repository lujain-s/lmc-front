import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddCourse from "./AddCourse";
import { Modal } from "react-bootstrap";
import { QueryClient, useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import Confirm from "../ui/confirmMessage";

export default function CourseSchedule() {
  const { request } = Operations();

  const [showModal, setShowModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [actionId, setActionId] = useState("");
  const [inetialData, setEnetialData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    setShowModal("addCourse");
    setEnetialData({});
    setIsNew(true);
  };

  const handleEdit = (data) => {
    setShowModal("editCourse");
    setEnetialData(data);
    setIsNew(false);
  };

  const fetchCourses = async () => {
    try {
      const res = await request.get("viewCourses");
      return res.data.Courses;
    } catch (err) {
      console.error(err);
    }
  };

  const {
    data: courses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const handleDelete = async () => {
    setLoading(true);
    try {
      await request.delete(`secretarya/deleteCourse/${actionId}`);
      setShowModal("");
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses =
    searchTerm.trim() === ""
      ? courses
      : courses.filter((course) => {
          const search = searchTerm.toLowerCase();

          const languageName = course.language?.Name?.toLowerCase() || "";
          const languageDesc =
            course.language?.Description?.toLowerCase() || "";
          const teacherName = course.user?.name?.toLowerCase() || "";
          const level = course.Level?.toLowerCase() || "";
          const description = course.Description?.toLowerCase() || "";

          return (
            languageName.includes(search) ||
            languageDesc.includes(search) ||
            teacherName.includes(search) ||
            level.includes(search) ||
            description.includes(search)
          );
        });

  const CourseItems = () => {
    if (filteredCourses.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center text-danger">
            No courses found
          </td>
        </tr>
      );
    }

    return filteredCourses.map((course, index) => {
      const schedule = course.course_schedule?.[0];

      return (
        <tr key={course.id}>
          <td>{index + 1}</td>
          <td>{course.language?.Name || "No name"}</td>
          <td style={{ color: "#007bff", fontWeight: "bold" }}>
            {course.user?.name || "Unknown"}
          </td>
          <td>
            {schedule
              ? `${schedule.Start_Time?.slice(
                  0,
                  5
                )} - ${schedule.End_Time?.slice(0, 5)}`
              : "—"}
          </td>
          <td className="text-center">
            {schedule ? `${schedule.Start_Date} → ${schedule.End_Date}` : "—"}
          </td>
          <td>
            <Link
              to={`/course-details/${course.id}`}
              className="btn btn-primary"
              style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
            >
              View
            </Link>
            <button
              className="btn btn-danger mx-1 text-light"
              onClick={() => {
                setShowModal("delete");
                setActionId(course.id);
              }}
            >
              <i className="fa fa-trash" />
            </button>
            <button
              className="btn btn-warning text-light"
              onClick={() => handleEdit(course)}
            >
              <i className="fa fa-pen" />
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className="pt-5 pb-5 mt-5">
        <h1
          className="text-center text-uppercase"
          style={{ letterSpacing: "5px", color: "#FF7F00" }}
        >
          Course Schedule
        </h1>
        <br />
        <div className="container">
          <p className="text-center">
            Type something in the input field to filter the table data, e.g.
            type (course name) in search field...
          </p>
          <input
            className="form-control package-item mb-0"
            id="courseSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search..."
          />
          <br />

          <div className="table-responsive card2 p-0 container mt-4 ">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    Course Language <i className="fa fa-book"></i>
                  </th>
                  <th>
                    Teacher Name <i className="fa fa-user"></i>
                  </th>
                  <th>
                    Time <i className="fa fa-clock"></i>
                  </th>
                  <th>
                    Date <i className="fa fa-calendar"></i>
                  </th>

                  <th>
                    Actions <i className="fa fa-info-circle"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <CourseItems />
              </tbody>
            </table>
          </div>

          {/* زر الإضافة العائم */}
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
              border: "none",
            }}
            onClick={handleAdd}
          >
            +
          </button>
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
                `}
      </style>

      <Modal
        show={showModal === "addCourse" || showModal === "editCourse"}
        onHide={() => setShowModal("")}
        size="lg"
        centered
      >
        <Modal.Body className="bg-darkblue ">
          <AddCourse
            onSubmit={() => {
              setShowModal("");
              refetch();
            }}
            initData={inetialData}
            isNew={isNew}
          />
        </Modal.Body>
      </Modal>
      <Confirm
        show={showModal === "delete"}
        title="Confirm deletion"
        message="Are you sure you want to delete this course?"
        onSuccess={() => handleDelete()}
        onClose={() => setShowModal("")}
        loading={loading}
      />
    </div>
  );
}
