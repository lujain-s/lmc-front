import { Routes, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faFilePen,
  faUsers,
  faSignOutAlt,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import EmployeeList from "../components/teachers/EmployeeList";
import AddEmployee from "../components/teachers/AddEmployee.js";
import Home from "../components/home/Home";
import StatisticsPage from "../components/statistics/StatisticPage";
import Profile from "../components/teachers/Profile.js";
import Services from "../components/services/Services.js";
import ContactPage from "../components/contact/ContactPage.js";
import Login from "../components/login/Login.js";
import About from "../components/services/About.js";
import HolidaysPage from "../components/free days/HolidaysPage.js";
import AddHoliday from "../components/free days/AddHolidayPage.js";
import StudentGradesPage from "../components/student/StudentGrades.js";
import CourseSchedule from "../components/courses schudle/CourseSchedule.js";
import EditEmployee from "../components/teachers/EditEmployee.js";
import AddCourse from "../components/courses schudle/AddCourse.js";
import CourseDetails from "../components/courses schudle/CourseDetails.js";
import StudentList from "../components/student/StudentList.js";
import StudentProfile from "../components/student/StudentProfile.js";
import ComplaintList from "../components/complaint/ComplaintList.js";
import ComplaintDetails from "../components/complaint/ComplaintDetails.js";
import "./Home.css";
import TasksList from "../components/Tasks/TasksList";
import AddTask from "../components/Tasks/AddTask";
import Footer from "../components/footer/footer.js";

function AutherizedAdmin() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content-container flex-grow-1">
        <Navbar />
        <div className="container main text-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/edit-employee/:id" element={<EditEmployee />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/holidays" element={<HolidaysPage />} />
            <Route path="/add-holiday" element={<AddHoliday />} />
            <Route path="/student-grade" element={<StudentGradesPage />} />
            <Route path="/courses-date" element={<CourseSchedule />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/course-details/:id" element={<CourseDetails />} />
            <Route path="/student-list" element={<StudentList />} />
            <Route path="/student-details/:id" element={<StudentProfile />} />
            <Route path="/complaint-list" element={<ComplaintList />} />
            <Route
              path="/complaint-details/:id"
              element={<ComplaintDetails />}
            />
            <Route path="/Tasks" element={<TasksList />} />
            <Route path="/assign-task" element={<AddTask />} />
            holidays
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AutherizedAdmin;
