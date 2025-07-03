import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import AddTask from "./AddTask";
import useOperations from "../back_component/Operations";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { useQuery } from "@tanstack/react-query";
import { FaHashtag, FaAlignLeft, FaCheckCircle, FaUser } from "react-icons/fa";
import "../../styles/colors.css";

const TasksList = () => {
  const { request, getUser } = useOperations();
  const user = getUser();
  const isAdmin = user && user.role === "SuperAdmin";
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    const url = isAdmin ? "super-admin/showTasks" : "staff/myTasks";
    const res = await request.get(url);
    return res.data.Tasks || [];
  };

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks", isAdmin],
    queryFn: fetchTasks,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const handleAddTask = () => {
    setShowModal(false);
    refetch();
  };
  const filteredTasks = tasks.filter(
    (task) =>
      task.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.Status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.users.some((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  useEffect(() => {
    $("#taskSearch").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#taskTable tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  }, []);

  return (
    <div className="pt-5 pb-5 mt-5">
      {isAdmin && (
        <button
          className="btn rounded-circle"
          style={{
            position: "fixed",
            bottom: "60px",
            right: "30px",
            width: "60px",
            height: "60px",
            fontSize: "30px",
            backgroundColor: "#1E3A5F",
            borderColor: "#1E3A5F",
            color: "#fff",
            boxShadow: "0 4px 8px #1E3A5F",
            zIndex: 1050,
            border: "none",
          }}
          onClick={() => setShowModal(true)}
          aria-label="Add Task"
        >
          +
        </button>
      )}
      <h1
        className="text-center text-uppercase"
        style={{ letterSpacing: "5px", color: "#FF7F00", fontWeight: 700 }}
      >
        LMC TASKS LIST
      </h1>
      <br />
      <div className="container">
        <p className="text-center">
          Type something in the input field to filter the table data, e.g. type
          (Task Description) in search field...
        </p>
        <input
          className="form-control mb-4"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="table-responsive card2 p-0 container mt-5">
          <table className="table mb-0 table-bordered table-striped">
            <thead className="align-middle">
              <tr>
                <th style={{ color: "#1E3A5F" }}>
                  <FaHashtag className="me-2" />
                  Task ID
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaAlignLeft className="me-2" />
                  Description
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaCheckCircle className="me-2" />
                  Status
                </th>
                <th style={{ color: "#1E3A5F" }}>
                  <FaUser className="me-2" />
                  User name
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((item, index) => (
                  <tr key={item.id || index}>
                    <td style={{ color: "#1E3A5F" }}>{item.id ?? "-"}</td>
                    <td style={{ color: "#1E3A5F" }}>
                      {item.Description ?? "-"}
                    </td>
                    <td style={{ color: "#1E3A5F" }}>{item.Status ?? "-"}</td>
                    <td style={{ color: "#1E3A5F" }}>
                      {item.users && item.users.length > 0
                        ? item.users.map((x, i) => (
                            <span key={i} style={{ marginRight: 6 }}>
                              {x.name}
                              {i !== item.users.length - 1 && <span> | </span>}
                            </span>
                          ))
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    {error}
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isAdmin && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1E3A5F", color: "white" }}
          >
            <Modal.Title>Add New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddTask onSubmit={handleAddTask} />
          </Modal.Body>
        </Modal>
      )}
      <style>{`
        input.form-control:focus,
        select.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default TasksList;
