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

const Sidebar = () => {
  const { getUser } = Operations();
  const user = getUser();
  // تحديد صلاحية المستخدم
  const isAdmin = user && user.role === "SuperAdmin";
  const isSecretary = user && user.role === "Secretarya";

  // التبويبات المسموحة للسكرتيرة
  const secretaryTabs = [
    { to: "/", icon: "columns", label: "Home" },
    { to: "/rooms", icon: "school", label: "Clases" },
    { to: "/profile", icon: "user", label: "Profile page" },
    { to: "/student-list", icon: "users", label: "Student List" },
    { to: "/announcements", icon: "users", label: "Announcements" },
  ];

  // كل التبويبات للإدمن (نفس الترتيب الحالي)
  const adminTabs = [
    { to: "/", icon: "columns", label: "Home" },
    { to: "/employee-list", icon: "table", label: "Employee List" },
    { to: "/holidays", icon: "calendar", label: "Holidays" },
    { to: "/language", icon: "language", label: "Language List" },
    { to: "/rooms", icon: "school", label: "Clases" },
    { to: "/profile", icon: "user", label: "Profile page" },
    { to: "/statistics", icon: "chart-line", label: "Analytics" },
    { to: "/student-grade", icon: "fas fa-chart-bar", label: "student grade" },
    { to: "/courses-date", icon: "clock", label: "Courses date" },
    { to: "/about", icon: "exclamation-circle", label: "Website info" },
    { to: "/invoices", icon: "list", label: "invoices" },
    { to: "/student-list", icon: "users", label: "Student List" },
    { to: "/services-manage", icon: "services", label: "Services Page" },
    { to: "/complaint-list", icon: "users", label: "Complaint List" },
    { to: "/announcements", icon: "users", label: "Announcements" },
    { to: "/Tasks", icon: "tasks", label: "Tasks" },
  ];

  // اختيار التبويبات حسب الدور
  const tabs = isAdmin ? adminTabs : isSecretary ? secretaryTabs : [];

  return (
    <div className=" sidebar-container ">
      <CDBSidebar className="sidebar-custom container">
        <CDBSidebarHeader
          className="sidebar-header"
          prefix={<i className="fa fa-bars fa-large"></i>}
        >
          <a href="/">Sidebar</a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            {tabs.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                exact
                to={to}
                activeClassName="activeClicked"
                className="side-item"
              >
                <CDBSidebarMenuItem icon={icon}>{label}</CDBSidebarMenuItem>
              </NavLink>
            ))}
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter className="sidebar-footer">
          Sidebar Footer
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
