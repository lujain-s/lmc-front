import { useEffect, useState } from "react";
import Operations from "../back_component/Operations";
import { getWeekDayName } from "../back_component/utils";
import "../../styles/colors.css";

export default function AddCourse({ onSubmit, initData, isNew }) {
  const { request } = Operations();

  const [teachers, setTeachers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [lessons, setLessons] = useState(0);

  const fetchRooms = async () => {
    try {
      const response = await request.get(`secretarya/showRooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const [course, setCourse] = useState({
    TeacherId: initData?.TeacherId || "",
    LanguageId: initData?.LanguageId || "",
    roomId: initData?.course_schedule?.RoomId || "",
    Description: initData?.Description || "",
    Start_Date: initData?.course_schedule?.[0]?.Start_Date || "",
    Start_Time: initData?.course_schedule?.[0]?.Start_Time || "",
    End_Time: initData?.course_schedule?.[0]?.End_Time || "",
    Start_Enroll: initData?.course_schedule?.[0]?.Start_Enroll || "",
    End_Enroll: initData?.course_schedule?.[0]?.End_Enroll || "",
    Level: initData?.Level || "",
    Number_of_lessons: initData?.lessons?.length || 0,
    CourseDays: initData?.course_schedule?.[0]?.CourseDays?.join(",") || "",
    Photo: initData?.Photo || null,
  });
  const fetchLessons = async () => {
    const res = await request.get(`getCourseLessons/${initData.id}`);
    setLessons(res.data.Lessons.length);
  };
  useEffect(() => {
    if (initData && !isNew) {
      fetchLessons();
      setCourse({
        TeacherId: initData?.TeacherId || "",
        LanguageId: initData?.LanguageId || "",
        roomId: initData?.course_schedule?.RoomId || "",
        Description: initData?.Description || "",
        Start_Date: initData?.course_schedule?.[0]?.Start_Date || "",
        Start_Time: initData?.course_schedule?.[0]?.Start_Time || "",
        End_Time: initData?.course_schedule?.[0]?.End_Time || "",
        Start_Enroll: initData?.course_schedule?.[0]?.Start_Enroll || "",
        End_Enroll: initData?.course_schedule?.[0]?.End_Enroll || "",
        Level: initData?.Level || "",
        Number_of_lessons: lessons || 0,
        CourseDays: initData?.course_schedule?.[0]?.CourseDays?.join(",") || "",
        Photo: initData?.Photo || null,
      });
    }
  }, [initData, lessons]);

  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await request.get("secretarya/getTeachers");
      setTeachers(res.data.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await request.get("showAllLanguage");
      setLanguages(res.data.data);
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchLanguages();
  }, []);

  const [preview, setPreview] = useState(
    initData?.Photo ? initData.Photo : null
  );

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      setCourse({ ...course, [name]: files[0] });
      if (files && files[0]) {
        setPreview(URL.createObjectURL(files[0]));
      } else {
        setPreview(null);
      }
    } else if (name === "CourseDays") {
      let selectedDays = course.CourseDays ? course.CourseDays.split(",") : [];

      if (checked) {
        if (!selectedDays.includes(value)) {
          selectedDays.push(value);
        }
      } else {
        selectedDays = selectedDays.filter((day) => day !== value);
      }

      setCourse({ ...course, CourseDays: selectedDays.join(",") });
    } else {
      setCourse({ ...course, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!course.CourseDays || course.CourseDays.trim() === "") {
      newErrors.CourseDays = "Please select at least one course day.";
    }

    if (new Date(course.Start_Date) < new Date(course.End_Enroll)) {
      newErrors.Start_Date =
        "Course start date must be after the enrollment end date.";
    }

    if (
      course.Start_Date &&
      course.CourseDays &&
      course.CourseDays.length > 0
    ) {
      const startDay = getWeekDayName(course.Start_Date);
      if (!course.CourseDays.includes(startDay)) {
        newErrors.dateRange =
          "The start date does not match any of the selected course days. Please adjust the start date.";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      for (const key in course) {
        if (key === "CourseDays") {
          formData.append(key, course[key]);
        } else if (Array.isArray(course[key])) {
          course[key].forEach((val) => formData.append(`${key}[]`, val));
        } else {
          formData.append(key, course[key]);
        }
      }

      if (isNew) {
        await request.post("secretarya/addCourse", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        onSubmit();
        setSuccess("تمت إضافة الكورس بنجاح!");
      } else {
        formData.append("CourseId", initData.id);
        await request.post(`secretarya/editCourse`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        onSubmit();
        setSuccess("تم تعديل الكورس بنجاح!");
      }

      if (isNew) {
        setCourse({
          TeacherId: "",
          RoomId: "",
          LanguageId: "",
          Description: "",
          Start_Date: "",
          Start_Time: "",
          End_Time: "",
          Level: "",
          Number_of_lessons: "",
          CourseDays: "",
          Start_Enroll: "",
          End_Enroll: "",
          Photo: null,
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "خطأ: فشل في تنفيذ العملية" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      <div className="row text-center mt-5 mb-2">
        <div className="col-lg-7 mx-auto">
          <h1 className="display-5" style={{ color: "#1E3A5F" }}>
            {isNew ? "Add New Course" : "Edit Course"}
          </h1>
          <p className="lead mb-0" style={{ color: "#FF7F00" }}>
            Here you can {isNew ? " add a new " : " edit the "} course
          </p>
          <hr />
        </div>
      </div>

      {success && (
        <div className="alert alert-success text-center">{success}</div>
      )}
      {errors.general && (
        <div className="alert alert-danger text-center">{errors.general}</div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form
            onSubmit={handleSubmit}
            className="card shadow rounded-4 border-0"
            style={{ background: "#fff" }}
          >
            <div
              className="card-header text-center"
              style={{
                backgroundColor: "#1E3A5F",
                color: "#fff",
                borderTopLeftRadius: "1.5rem",
                borderTopRightRadius: "1.5rem",
              }}
            >
              <h3>{isNew ? "Add Course" : "Edit Course"}</h3>
            </div>
            <div className="card-body">
              {/* Select Teacher */}
              <div className="mb-3 text-start">
                <label className="form-label">Select Teacher</label>
                <select
                  name="TeacherId"
                  className="form-control"
                  value={course.TeacherId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 text-start">
                <label className="form-label">Select Room</label>
                <select
                  name="RoomId"
                  className="form-control"
                  value={course.RoomId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Room Number --</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.NumberOfRoom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Language */}
              <div className="mb-3 text-start">
                <label className="form-label">Select Language</label>
                <select
                  name="LanguageId"
                  className="form-control"
                  value={course.LanguageId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Language --</option>
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other Fields */}
              {[
                {
                  name: "Level",
                  label: "Level",
                  type: "text",
                  placeholder: "Beginner, Intermediate...",
                },
                {
                  name: "Number_of_lessons",
                  label: "Number of Lessons",
                  type: "number",
                  placeholder: "10",
                },
                { name: "Start_Time", label: "Start Time", type: "time" },
                { name: "End_Time", label: "End Time", type: "time" },
                {
                  name: "Start_Date",
                  label: "Course Start Date",
                  type: "date",
                  min: course.End_Enroll
                    ? new Date(course.End_Enroll).toISOString().split("T")[0]
                    : undefined,
                },
              ].map((field, idx) => (
                <div className="mb-3 text-start" key={idx}>
                  <label className="form-label">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={course[field.name]}
                    onChange={handleChange}
                    className={`form-control ${
                      errors[field.name] ? "is-invalid" : ""
                    }`}
                    placeholder={field.placeholder}
                    min={field.min}
                    required
                  />
                  {errors[field.name] && (
                    <div className="invalid-feedback">{errors[field.name]}</div>
                  )}
                </div>
              ))}

              {/* Enrollment Start Date */}
              <div className="mb-3 text-start">
                <label className="form-label">Enrollment Start Date</label>
                <input
                  type="date"
                  name="Start_Enroll"
                  value={course.Start_Enroll}
                  onChange={handleChange}
                  className="form-control"
                  max={course.End_Enroll ? course.End_Enroll : undefined}
                  required
                />
              </div>

              {/* Enrollment End Date */}
              <div className="mb-3 text-start">
                <label className="form-label">Enrollment End Date</label>
                <input
                  type="date"
                  name="End_Enroll"
                  value={course.End_Enroll}
                  onChange={handleChange}
                  className="form-control"
                  min={course.Start_Enroll ? course.Start_Enroll : undefined}
                  max={
                    course.Start_Date
                      ? new Date(
                          new Date(course.Start_Date).getTime() -
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      : undefined
                  }
                  required
                />
                {errors.Start_Date && (
                  <div className="text-danger small mt-1">
                    {errors.Start_Date}
                  </div>
                )}
              </div>

              {/* Course Days */}
              <div className="mb-3 text-start">
                <label className="form-label">Course Days</label>
                <div>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`courseDay-${day}`}
                          name="CourseDays"
                          value={day}
                          checked={course.CourseDays.split(",").includes(day)}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`courseDay-${day}`}
                        >
                          {day}
                        </label>
                      </div>
                    )
                  )}
                </div>
                {errors.CourseDays && (
                  <div className="text-danger small mt-1">
                    {errors.CourseDays}
                  </div>
                )}
              </div>

              {/* Course Description */}
              <div className="mb-3 text-start">
                <label className="form-label">Course Description</label>
                <textarea
                  name="Description"
                  className="form-control"
                  value={course.Description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              {/* Upload Photo */}
              <div className="mb-3 text-start">
                <label className="form-label">Course Image</label>
                <input
                  type="file"
                  name="Photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="form-control"
                />
                {preview && (
                  <div className="mt-3 text-center">
                    <img
                      src={preview}
                      alt="Course Preview"
                      style={{
                        maxWidth: "180px",
                        maxHeight: "180px",
                        borderRadius: "12px",
                        border: "3px solid var(--primary-color)",
                        boxShadow: "0 2px 8px #eee",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Date range error */}
              {errors.dateRange && (
                <div className="alert alert-danger text-center">
                  {errors.dateRange}
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="button-blue px-5"
                  style={{ fontWeight: 600, fontSize: 18 }}
                >
                  {loading ? "loading..." : isNew ? "Add Course" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
