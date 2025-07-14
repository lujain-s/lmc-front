import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import {
  FaUserGraduate,
  FaUserPlus,
  FaChalkboardTeacher,
  FaBookOpen,
  FaCheckCircle,
  FaChartLine,
  FaUserTimes,
  FaStar,
} from "react-icons/fa";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatisticsPage = () => {
  const { request } = Operations();
  // جلب بيانات الإحصائيات من الخادم
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await request.get("super-admin/viewStatistics");
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 5 * 60 * 1000,
  });

  // معالجة البيانات حسب هيكل الاستجابة المتوقع
  // عدل هذه الأسماء حسب ما يرجعه الباكند فعلياً
  const studentData = data?.studentsPerCourse || [];
  const languageData = data?.languagesPopularity || [];
  const courseData = data?.coursesOverYears || [];

  return (
    <div className="min-h-screen mt-20 bg-gray-100 p-8">
      {/* عنوان الصفحة */}
      <h1
        className="text-4xl font-bold text-gray-800 text-center mb-12"
        style={{ color: "#FF7F00" }}
      >
        Institute Statistics
      </h1>

      {/* كروت الإحصائيات الرقمية */}
      {!isLoading && !isError && data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-l-8"
            style={{ borderLeftColor: "#FF7F00", minHeight: 160 }}
          >
            <FaUserGraduate
              size={36}
              className="mb-2"
              style={{ color: "#FF7F00" }}
            />
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {data.data["Total Students"] ?? 0}
            </div>
            <div className="text-gray-700 font-semibold">Total Students</div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-l-8"
            style={{ borderLeftColor: "#1E3A5F", minHeight: 160 }}
          >
            <FaUserPlus
              size={36}
              className="mb-2"
              style={{ color: "#1E3A5F" }}
            />
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {data.data["New students this month"] ?? 0}
            </div>
            <div className="text-gray-700 font-semibold">
              New Students This Month
            </div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-l-8"
            style={{ borderLeftColor: "#FF7F00", minHeight: 160 }}
          >
            <FaChalkboardTeacher
              size={36}
              className="mb-2"
              style={{ color: "#FF7F00" }}
            />
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {data.data["Active Teachers"] ?? 0}
            </div>
            <div className="text-gray-700 font-semibold">Active Teachers</div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-l-8"
            style={{ borderLeftColor: "#1E3A5F", minHeight: 160 }}
          >
            <FaBookOpen
              size={36}
              className="mb-2"
              style={{ color: "#1E3A5F" }}
            />
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {data.data["Active Courses"] ?? 0}
            </div>
            <div className="text-gray-700 font-semibold">Active Courses</div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-l-8"
            style={{ borderLeftColor: "#FF7F00", minHeight: 160 }}
          >
            <FaCheckCircle
              size={36}
              className="mb-2"
              style={{ color: "#FF7F00" }}
            />
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {data.data["Completed Courses"] ?? 0}
            </div>
            <div className="text-gray-700 font-semibold">Completed Courses</div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-l-8"
            style={{ borderLeftColor: "#1E3A5F", minHeight: 160 }}
          >
            <FaStar size={36} className="mb-2" style={{ color: "#1E3A5F" }} />
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {data.data["Average Of final grades"] ?? "--"}
            </div>
            <div className="text-gray-700 font-semibold">
              Average Final Grades
            </div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-l-8"
            style={{ borderLeftColor: "#FF7F00", minHeight: 160 }}
          >
            <FaUserTimes
              size={36}
              className="mb-2"
              style={{ color: "#FF7F00" }}
            />
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {data.data["Students Without Final Test"] ?? 0}
            </div>
            <div className="text-gray-700 font-semibold">
              Students Without Final Test
            </div>
          </div>
        </div>
      )}

      {/* كارد أفضل كورس */}
      {!isLoading && !isError && data?.data?.["Top Course"] && (
        <div
          className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center mb-10 border-l-4"
          style={{
            borderLeftColor: "#FF7F00",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <img
            src={data.data["Top Course"].Photo}
            alt="Top Course"
            className="rounded-lg shadow-md mb-4 md:mb-0 md:mr-6"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              border: "3px solid #FF7F00",
            }}
          />
          <div className="flex-1 text-center md:text-left">
            <div className="text-xl font-bold text-orange-500 mb-2">
              Top Course
            </div>
            <div className="text-gray-700 mb-1">
              <span className="font-semibold">Description:</span>{" "}
              {data.data["Top Course"].Description}
            </div>
            <div className="text-gray-700 mb-1">
              <span className="font-semibold">Enrollments:</span>{" "}
              {data.data["Top Course"].enrollment_count}
            </div>
            <div className="text-gray-700 mb-1">
              <span className="font-semibold">Status:</span>{" "}
              {data.data["Top Course"].Status}
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Level:</span>{" "}
              {data.data["Top Course"].Level}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-lg text-gray-500">
          Loading statistics...
        </div>
      ) : isError ? (
        <div className="text-center text-danger">
          Error loading statistics: {error?.message || "Unknown error"}
        </div>
      ) : null}
    </div>
  );
};

export default StatisticsPage;
