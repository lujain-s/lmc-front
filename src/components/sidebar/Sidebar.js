import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import Operations from "../back_component/Operations";
import "./Sidebar.css"; // استيراد ملف الـ CSS
import {
  FaHome,
  FaInfoCircle,
  FaConciergeBell,
  FaPhone,
  FaUserTie,
  FaCalendarAlt,
  FaLanguage,
  FaSchool,
  FaUser,
  FaChartLine,
  FaChartBar,
  FaClock,
  FaExclamationCircle,
  FaList,
  FaUsers,
  FaTools,
  FaBullhorn,
  FaTasks,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Sidebar = () => {
  const { getUser } = Operations();
  const user = getUser();
  // تحديد صلاحية المستخدم
  const isAdmin = user && user.role === "SuperAdmin";
  const isSecretary = user && user.role === "Secretarya";
  const pathName = window.location.pathname;
  console.log("path", pathName);
  // التبويبات المسموحة للسكرتيرة
  const secretaryTabs = [
    { to: "/", icon: <FaHome />, label: "Home" },
    { to: "/rooms", icon: <FaSchool />, label: "Clases" },
    { to: "/profile", icon: <FaUser />, label: "Profile page" },
    { to: "/student-list", icon: <FaUsers />, label: "Student List" },
    { to: "/announcements", icon: <FaBullhorn />, label: "Announcements" },
  ];

  // كل التبويبات للإدمن (مرتبة كمجموعات)
  const adminTabs = [
    // مجموعة الموقع العام
    {
      group: "General",
      items: [
        { to: "/", icon: <FaHome />, label: "Home" },
        { to: "/about", icon: <FaInfoCircle />, label: "About" },
        { to: "/services", icon: <FaConciergeBell />, label: "Services" },
        { to: "/contact", icon: <FaPhone />, label: "Contact" },
      ],
    },
    // مجموعة الإدارة
    {
      group: "Management",
      items: [
        { to: "/employee-list", icon: <FaUserTie />, label: "Employee List" },
        { to: "/holidays", icon: <FaCalendarAlt />, label: "Holidays" },
        { to: "/language", icon: <FaLanguage />, label: "Language List" },
        { to: "/rooms", icon: <FaSchool />, label: "Clases" },
        { to: "/profile", icon: <FaUser />, label: "Profile page" },
        { to: "/statistics", icon: <FaChartLine />, label: "Analytics" },
        { to: "/student-grade", icon: <FaChartBar />, label: "Student grade" },
        { to: "/courses-date", icon: <FaClock />, label: "Courses date" },
        { to: "/about", icon: <FaExclamationCircle />, label: "Website info" },
        { to: "/invoices", icon: <FaFileInvoiceDollar />, label: "Invoices" },
        { to: "/student-list", icon: <FaUsers />, label: "Student List" },
        { to: "/services-manage", icon: <FaTools />, label: "Services Page" },
        { to: "/complaint-list", icon: <FaList />, label: "Complaint List" },
        { to: "/announcements", icon: <FaBullhorn />, label: "Announcements" },
        { to: "/Tasks", icon: <FaTasks />, label: "Tasks" },
      ],
    },
  ];

  // اختيار التبويبات حسب الدور
  let tabs = [];
  if (isAdmin) {
    tabs = [
      { to: "/", icon: "columns", label: "Home" },
      { to: "/about", icon: "info-circle", label: "About" },
      { to: "/services", icon: "concierge-bell", label: "Services" },
      { to: "/contact", icon: "phone", label: "Contact" },
      { to: "/employee-list", icon: "user-tie", label: "Employee List" },
      { to: "/holidays", icon: "calendar", label: "Holidays" },
      { to: "/language", icon: "language", label: "Language List" },
      { to: "/rooms", icon: "school", label: "Clases" },
      { to: "/profile", icon: "user", label: "Profile page" },
      { to: "/statistics", icon: "chart-line", label: "Analytics" },
      { to: "/student-grade", icon: "graduation-cap", label: "Student grade" },
      { to: "/courses-date", icon: "clock", label: "Courses date" },
      { to: "/about", icon: "info-circle", label: "Website info" },
      { to: "/invoices", icon: "file", label: "Invoices" },
      { to: "/student-list", icon: "users", label: "Student List" },
      { to: "/services-manage", icon: "wrench", label: "Services Page" },
      { to: "/complaint-list", icon: "list", label: "Complaint List" },
      { to: "/announcements", icon: "bullhorn", label: "Announcements" },
      { to: "/Tasks", icon: "tasks", label: "Tasks" },
    ];
  } else if (isSecretary) {
    tabs = [
      { to: "/", icon: "columns", label: "Home" },
      { to: "/rooms", icon: "school", label: "Clases" },
      { to: "/profile", icon: "user", label: "Profile page" },
      { to: "/student-list", icon: "users", label: "Student List" },
      { to: "/announcements", icon: "bullhorn", label: "Announcements" },
      { to: "/Tasks", icon: "tasks", label: "My Tasks" },
    ];
  }

  return (
    <div className=" sidebar-container ">
      <CDBSidebar className="sidebar-custom container">
        <CDBSidebarHeader
          className="sidebar-header"
          prefix={<i className="fa fa-bars fa-large"></i>}
        >
          <a href="/">LMC</a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            {tabs.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `side-item${isActive ? " active" : ""}`
                }
                end
              >
                <CDBSidebarMenuItem icon={icon}>{label}</CDBSidebarMenuItem>
              </NavLink>
            ))}
          </CDBSidebarMenu>
        </CDBSidebarContent>

        {/* <CDBSidebarFooter className="sidebar-footer">
          Sidebar Footer
        </CDBSidebarFooter> */}
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
