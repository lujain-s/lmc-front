import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddCourse from "./AddCourse";
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
  FaTrash,
  FaPen,
  FaEye,
} from "react-icons/fa";

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
          <td colSpan="6" className="text-center ">
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
          <td style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
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
              className="button-blue me-1"
              style={{
                padding: "4px 14px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              <FaEye />
            </Link>
            <button
              className="button-blue me-1"
              style={{ padding: "4px 12px", fontSize: 18 }}
              onClick={() => {
                setShowModal("delete");
                setActionId(course.id);
              }}
            >
              <FaTrash />
            </button>
            <button
              className="button-orange"
              style={{ padding: "4px 12px", fontSize: 18 }}
              onClick={() => handleEdit(course)}
            >
              <FaPen />
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
          style={{ letterSpacing: "5px", color: "#FF7F00", fontWeight: 700 }}
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
                  <th>
                    <FaHashtag className="me-2" />#
                  </th>
                  <th>
                    <FaBook className="me-2" />
                    Course Language
                  </th>
                  <th>
                    <FaUser className="me-2" />
                    Teacher Name
                  </th>
                  <th>
                    <FaClock className="me-2" />
                    Time
                  </th>
                  <th>
                    <FaCalendar className="me-2" />
                    Date
                  </th>
                  <th>
                    <FaInfoCircle className="me-2" />
                    Actions
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
            color: var(--primary-color) !important;
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
