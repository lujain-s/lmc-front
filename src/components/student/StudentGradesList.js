import React from "react";
import { useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import { FaHashtag, FaUser, FaEnvelope, FaStar, FaCrown } from "react-icons/fa";

export default function StudentGradesList({ courseId }) {
  const { request } = Operations();

  // جلب جميع العلامات
  const fetchGrades = async () => {
    const res = await request.get(
      `super-admin/reviewFinalGradesForCourse/${courseId}`
    );
    return res.data;
  };

  // جلب الطالب صاحب أعلى علامة
  const fetchTopStudent = async () => {
    const res = await request.get(
      `super-admin/getTopStudentForCourse/${courseId}`
    );
    return res.data;
  };

  const {
    data: grades = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["grades", courseId],
    queryFn: fetchGrades,
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: topStudent,
    isLoading: loadingTop,
    isError: errorTop,
  } = useQuery({
    queryKey: ["topStudent", courseId],
    queryFn: fetchTopStudent,
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="pt-4 pb-4 mt-4 container">
      <h2
        className="text-center text-uppercase mb-4"
        style={{ letterSpacing: "5px", color: "#FF7F00", fontWeight: 700 }}
      >
        Students Grades
      </h2>

      {/* بطاقة الطالب صاحب أعلى علامة */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm border-warning">
            <div className="card-body d-flex align-items-center gap-3">
              <FaCrown size={36} color="#FFD700" style={{ flexShrink: 0 }} />
              {loadingTop ? (
                <span>Loading top student...</span>
              ) : errorTop ? (
                <span className="text-danger">Error loading top student.</span>
              ) : topStudent && (topStudent.StudentName || topStudent.name) ? (
                <>
                  <div>
                    <h5
                      className="mb-1"
                      style={{ color: "#FF7F00", fontWeight: 700 }}
                    >
                      Top Student: {topStudent.StudentName || topStudent.name}
                    </h5>
                    <div className="mb-0 text-muted">
                      <FaEnvelope className="me-2" />
                      {topStudent.StudentEmail || topStudent.email || "Unknown"}
                    </div>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-warning text-dark fs-5">
                      <FaStar className="me-1" color="#FFD700" />
                      {topStudent.FinalGrade ?? topStudent.grade ?? "-"}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-muted">No top student found.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive card2 p-0 mt-4">
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
              <th style={{ color: "#1E3A5F" }}>
                <FaStar className="me-2" />
                Final Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4}>Loading...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={4}>{error?.message || "Error loading grades."}</td>
              </tr>
            )}
            {grades && grades.length > 0
              ? grades.map((item, idx) => (
                  <tr key={item.StudentId || idx}>
                    <td>{idx + 1}</td>
                    <td>{item.StudentName || item.name || "Unknown"}</td>
                    <td>{item.StudentEmail || item.email || "Unknown"}</td>
                    <td>{item.FinalGrade ?? item.grade ?? "-"}</td>
                  </tr>
                ))
              : !isLoading && (
                  <tr>
                    <td colSpan={4} className="text-muted">
                      No grades found.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
