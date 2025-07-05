import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import StudentList from "../student/StudentList";
import Operations from "../back_component/Operations";
import { useQuery } from "@tanstack/react-query";

export default function CourseDetails() {
  const { request } = Operations();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const fetchLessons = async () => {
    try {
      const res = await request.get(`getCourseLessons/${id}`);
      setLessons(res.data.Lessons || []);
    } catch (error) {
      console.log(error);
      setLessons([]);
    }
  };
  useEffect(() => {
    if (id) {
      fetchLessons();
    }
  }, [id]);
  const fetchCourseData = async () => {
    try {
      const res = await request.get(`viewCourse/${id}`);
      const rawCourse = res.data.Course;

      return {
        id: rawCourse.id,
        name: rawCourse.language?.Name || "Unnamed Course",
        type: rawCourse.Level,
        description: rawCourse.Description,
        teacher: rawCourse.user?.name || "N/A",
        schedule: `${rawCourse.course_schedule[0]?.Start_Time} to ${rawCourse.course_schedule[0]?.End_Time}`,
        startDate: rawCourse.course_schedule[0]?.Start_Date,
        endDate: rawCourse.course_schedule[0]?.End_Date,
        lessons: [],
      };
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: courseData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courses", id],
    queryFn: fetchCourseData,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
    }
  }, [courseData]);

  if (isLoading || !course)
    return <div className="text-center mt-5">Loading...</div>;
  if (isError)
    return (
      <div className="text-danger text-center mt-5">Error loading course.</div>
    );

  return (
    <div className="container py-5">
      <div className="row text-center mt-5 mb-2">
        <div className="col-lg-7 mx-auto">
          <h1 className="display-5">Course Details: {course.name}</h1>
          <p className="lead mb-0">
            Here you can see the details of the course and add new lessons
          </p>
          <hr />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card shadow mb-4">
            <div className="card-header bg-dark text-warning">
              <h3>Course Information</h3>
            </div>
            <div className="card-body text-darkblue">
              <p>
                <strong>Type:</strong> {course.type}
              </p>
              <p>
                <strong>Description:</strong> {course.description}
              </p>
              <p>
                <strong>Teacher:</strong> {course.teacher}
              </p>
              <p>
                <strong>Schedule:</strong> {course.schedule}
              </p>
              <p>
                <strong>Date Range:</strong> {course.startDate} to{" "}
                {course.endDate}
              </p>
            </div>
          </div>

          <div className="card shadow mb-4">
            <div className="card-header bg-dark text-warning">
              <h4>Lessons</h4>
            </div>
            <div className="card-body">
              {lessons && lessons.length > 0 ? (
                <ul className="list-group">
                  {lessons.map((lesson) => (
                    <li key={lesson.lessonId} className="list-group-item">
                      <strong>{lesson.Title}</strong> – {lesson.Date}
                      <p>{lesson.Start_Time}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No lessons yet.</p>
              )}
            </div>
          </div>

          <StudentList id={id} start={course.startDate} />

          <style>{`
                .custom-btn {
                  background-color: #1E3A5F;
                  border-color: #1E3A5F;
                  color: white;
                  transition: background-color 0.3s ease;
                }
                .custom-btn:hover,
                .custom-btn:focus {
                  background-color: #FF7F00 !important;
                  border-color: #FF7F00 !important;
                  color: white;
                }
                .custom-btn:active {
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
              `}</style>
        </div>
      </div>
    </div>
  );
}
