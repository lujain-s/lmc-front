import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const studentData = [
  { name: "English", students: 500 },
  { name: "French", students: 300 },
  { name: "German", students: 200 },
  { name: "Spanish", students: 400 },
];

const languageData = [
  { name: "English", value: 60 },
  { name: "French", value: 10 },
  { name: "German", value: 15 },
  { name: "Spanish", value: 15 },
];

const courseData = [
  { year: "2020", courses: 20 },
  { year: "2021", courses: 25 },
  { year: "2022", courses: 30 },
  { year: "2023", courses: 35 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatisticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* عنوان الصفحة */}
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-12" style={{ color: "#FF7F00"}}>Institute Statistics</h1>

      {/* الشبكة الرئيسية لتنسيق الرسومات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* الرسم البياني العمودي */}
        <div className="bg-white p-5 rounded-lg shadow-md my-5 py-5 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6" style={{ color: "#1E3A5F"}}>📊 Students Per Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentData} >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#FF7F00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* الرسم البياني الدائري */}
        <div className="bg-white p-5 rounded-lg shadow-md my-5 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6" style={{ color: "#1E3A5F"}}>📈 Languages Popularity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={languageData} cx="50%" cy="50%" outerRadius={110} fill="#82ca9d" dataKey="value" label>
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* الرسم البياني الخطي */}
      <div className="bg-white p-5 rounded-lg shadow-md my-5 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6" style={{ color: "#1E3A5F"}}>📉 Courses Over The Years</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={courseData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="courses" stroke="#ff7300" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default StatisticsPage;
