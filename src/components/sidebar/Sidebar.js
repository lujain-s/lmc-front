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
import "./Sidebar.css"; // استيراد ملف الـ CSS
const Sidebar = () => {
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
            <NavLink
              exact
              to="/"
              activeClassName="activeClicked"
              className="side-item"
            >
              <CDBSidebarMenuItem icon="columns">Home</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/employee-list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">
                Employee List
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/holidays" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="calendar">Holidays</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/profile" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/statistics" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">
                Analytics
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/student-grade" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="fas fa-chart-bar">
                student grade
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/courses-date" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="clock">Courses date</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/about" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">
                Website info
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/student-list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="users">Student List</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/complaint-list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="users">
                Complaint List
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/Tasks" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="tasks">Tasks</CDBSidebarMenuItem>
            </NavLink>
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
