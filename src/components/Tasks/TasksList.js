import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import AddTask from "./AddTask";
import useOperations from "../back_component/Operations";
import Confirm from "../ui/confirmMessage";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { useQuery } from "@tanstack/react-query";
import {
  FaHashtag,
  FaAlignLeft,
  FaCheckCircle,
  FaUser,
  FaEdit,
  FaTrash,
  FaCheck,
  FaEye,
  FaCalendarAlt,
  FaFileInvoice,
  FaClock,
} from "react-icons/fa";
import "../../styles/colors.css";

const TasksList = () => {
  const { request, getUser } = useOperations();
  const user = getUser();
  const isAdmin = user && user.role === "SuperAdmin";
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  const fetchTasks = async () => {
    const url = isAdmin ? "super-admin/showTasks" : "staff/myTasks";
    const res = await request.get(url);

    if (isAdmin) {
      // For admin: return tasks directly
      return res.data.Tasks || [];
    } else {
      // For staff: extract tasks from assigned_tasks array
      return res.data.assigned_tasks || [];
    }
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

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return;

    setDeleteLoading(true);
    try {
      await request.delete(`super-admin/deleteTask/${selectedTask.id}`);
      setShowDeleteConfirm(false);
      setSelectedTask(null);
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSubmit = () => {
    setShowEditModal(false);
    setSelectedTask(null);
    refetch();
  };

  const handleCompleteTask = async (task) => {
    setCompleteLoading(true);
    try {
      await request.post(`staff/completeUserTask/${task.id}`);
      refetch();
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleViewTaskDetails = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  // Check if task is completed by current user
  const isTaskCompletedByUser = (task) => {
    if (!user || !task.users) return false;

    const currentUserInTask = task.users.find((u) => u.id === user.id);
    return currentUserInTask?.pivot?.Completed === 1;
  };

  // Format user names for display (limit to 2 names + "...")
  const formatUserNames = (users) => {
    if (!users || users.length === 0) return "-";

    if (users.length <= 2) {
      return users.map((user, index) => (
        <span key={user.id} style={{ marginRight: 6 }}>
          {user.name}
          {index !== users.length - 1 && <span> | </span>}
        </span>
      ));
    }

    return (
      <span>
        {users[0].name} | {users[1].name}...
        <span className="text-muted">(+{users.length - 2} more)</span>
      </span>
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.Status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.users?.some((user) =>
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
                <th style={{ color: "#1E3A5F", maxWidth: "200px" }}>
                  <FaUser className="me-2" />
                  User name
                </th>
                <th style={{ color: "#1E3A5F" }}>Actions</th>
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
                    <td style={{ color: "#1E3A5F", maxWidth: "200px" }}>
                      {formatUserNames(item.users)}
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        {/* View Task Details Button - Available for all users */}
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#1E3A5F",
                            borderColor: "#1E3A5F",
                            color: "white",
                            borderRadius: "6px",
                            padding: "6px 12px",
                          }}
                          onClick={() => handleViewTaskDetails(item)}
                          title="View Task Details"
                        >
                          <FaEye />
                        </button>

                        {/* Complete Task Button - Show for non-completed tasks and non-admin users */}
                        {!isAdmin && !isTaskCompletedByUser(item) && (
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#28a745",
                              borderColor: "#28a745",
                              color: "white",
                              borderRadius: "6px",
                              padding: "6px 12px",
                            }}
                            onClick={() => handleCompleteTask(item)}
                            disabled={completeLoading}
                            title="Complete Task"
                          >
                            <FaCheck />
                          </button>
                        )}

                        {/* Show completed status for non-admin users */}
                        {!isAdmin && isTaskCompletedByUser(item) && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "6px",
                            }}
                          >
                            Completed
                          </span>
                        )}

                        {/* Edit and Delete buttons - Show only for admin */}
                        {isAdmin && (
                          <>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#FF7F00",
                                borderColor: "#FF7F00",
                                color: "white",
                                borderRadius: "6px",
                                padding: "6px 12px",
                              }}
                              onClick={() => handleEditTask(item)}
                              title="Edit Task"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#dc3545",
                                borderColor: "#dc3545",
                                color: "white",
                                borderRadius: "6px",
                                padding: "6px 12px",
                              }}
                              onClick={() => handleDeleteClick(item)}
                              title="Delete Task"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    {error}
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
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

      {/* Edit Task Modal */}
      {isAdmin && selectedTask && (
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1E3A5F", color: "white" }}
          >
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddTask
              onSubmit={handleEditSubmit}
              editMode={true}
              taskData={selectedTask}
            />
          </Modal.Body>
        </Modal>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <Modal
          show={showTaskDetails}
          onHide={() => {
            setShowTaskDetails(false);
            setSelectedTask(null);
          }}
          centered
          size="lg"
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1E3A5F", color: "white" }}
          >
            <Modal.Title>
              <FaAlignLeft className="me-2" />
              Task Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ color: "#1E3A5F" }}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <h6 className="fw-bold">
                    <FaHashtag className="me-2" />
                    Task ID
                  </h6>
                  <p className="mb-0">{selectedTask.id}</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">
                    <FaAlignLeft className="me-2" />
                    Description
                  </h6>
                  <p className="mb-0">{selectedTask.Description}</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">
                    <FaCheckCircle className="me-2" />
                    Status
                  </h6>
                  <span
                    className={`badge ${
                      selectedTask.Status === "Completed"
                        ? "bg-success"
                        : selectedTask.Status === "Pending"
                        ? "bg-warning"
                        : "bg-secondary"
                    }`}
                  >
                    {selectedTask.Status}
                  </span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <h6 className="fw-bold">
                    <FaCalendarAlt className="me-2" />
                    Deadline
                  </h6>
                  <p className="mb-0">
                    {selectedTask.Deadline
                      ? new Date(selectedTask.Deadline).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not set"}
                  </p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">
                    <FaFileInvoice className="me-2" />
                    Requires Invoice
                  </h6>
                  <span
                    className={`badge ${
                      selectedTask.RequiresInvoice ? "bg-info" : "bg-secondary"
                    }`}
                  >
                    {selectedTask.RequiresInvoice ? "Yes" : "No"}
                  </span>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">
                    <FaClock className="me-2" />
                    Created At
                  </h6>
                  <p className="mb-0">
                    {selectedTask.created_at
                      ? new Date(selectedTask.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h6 className="fw-bold">
                <FaUser className="me-2" />
                Assigned Users ({selectedTask.users?.length || 0})
              </h6>
              <div className="row">
                {selectedTask.users?.map((user, index) => (
                  <div key={user.id} className="col-md-6 mb-2">
                    <div
                      className="card border-0"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <div className="card-body py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{user.name}</strong>
                            <br />
                            <small className="text-muted">{user.email}</small>
                          </div>
                          <div>
                            {user.pivot?.Completed === 1 ? (
                              <span className="badge bg-success">
                                Completed
                              </span>
                            ) : (
                              <span className="badge bg-warning">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Confirm
        show={showDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete task "${selectedTask?.Description}"? This action cannot be undone.`}
        onSuccess={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedTask(null);
        }}
        loading={deleteLoading}
      />

      <style>{`
        input.form-control:focus,
        select.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }
        
        .btn:hover {
          opacity: 0.8;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }

        .table td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default TasksList;
