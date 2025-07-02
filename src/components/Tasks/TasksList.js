import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import AddTask from "./AddTask";
import useOperations from "../back_component/Operations";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { useQuery } from "@tanstack/react-query";

const TasksList = () => {
  const { request } = useOperations();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    const res = await request.get("super-admin/showTasks");
    return res.data.Tasks || [];
  };

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
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
    <div className="container min-vh-100 d-flex flex-column align-items-center bg-light pt-5">
      <h1
        className="text-center text-uppercase gap-2 pt-1 pb-5 mt-5"
        style={{
          letterSpacing: "5px",
          color: "#FF7F00",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        LMC TASKS LIST
      </h1>

      <p className="text-center">
        Type something in the input field to filter the table data, e.g. type
        (انتبهي للبحث ناقص) in search field...
      </p>
      <input
        className="form-control package-item mb-0"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <br />

      <div className="table-responsive card2 p-0 w-100">
        <table className="table mb-0 table-bordered table-striped">
          <thead>
            <tr>
              <th style={{ color: "#1E3A5F" }}>Task ID</th>
              <th style={{ color: "#1E3A5F" }}>Description</th>
              <th style={{ color: "#1E3A5F" }}>Status</th>
              <th style={{ color: "#1E3A5F" }}>User name</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.id ?? "-"}</td>
                  <td>{item.Description ?? "-"}</td>
                  <td>{item.Status ?? "-"}</td>
                  <td className="d-flex gap-1">
                    {item.users.map((x) => <p>{x.name + " " + "|"}</p>) ?? "-"}
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  {error}
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      <style>{`
        .custom-btn {
          background-color: #1E3A5F;
          border-color: #1E3A5F;
          color: white;
        }
        .custom-btn:hover,
        .custom-btn:focus {
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
  );
};

export default TasksList;
