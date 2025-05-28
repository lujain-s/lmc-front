import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import AddTask from "./AddTask";
import useOperations from "../back_component/Operations";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";


const TasksList = () => {
  const { request } = useOperations();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await request.get('super-admin/showTasks');
      setTasks(res.data.Tasks || []);
      console.log("Tasks fetched:", res.data.Tasks);
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_NETWORK") {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: error.response?.data?.message || "Unknown error" });
      }
    }
  };

  const handleAddTask = () => {
    setShowModal(false);
    fetchTasks();
  };

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
                        Type something in the input field to filter the table data, e.g. type  (انتبهي للبحث ناقص) in search field...
                    </p>
                    <input className="form-control package-item mb-0" id="courseSearch" type="text" placeholder="Search..." />
                    <br />

      {errors.general && (
        <div className="alert alert-danger w-100 text-center" role="alert">
          {errors.general}
        </div>
      )}

      <div className="table-responsive card2 p-0 w-100">
        <table className="table mb-0 table-bordered table-striped">
        <thead>
  <tr>
    <th style={{ color: "#1E3A5F" }}>Task ID</th>
    <th style={{ color: "#1E3A5F" }}>Status</th>
    <th style={{ color: "#1E3A5F" }}>User ID</th>
  </tr>
</thead>

<tbody>
  {tasks.length > 0 ? (
    tasks.map((item, index) => (
      <tr key={item.id || index}>
        <td>{item.id ?? "N/A"}</td>           
        <td>{item.Status ?? "N/A"}</td>       
        <td>{item.CreatorId ?? "N/A"}</td>    
      </tr>
    ))
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
        <Modal.Header closeButton style={{ backgroundColor: "#1E3A5F", color: "white" }}>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTask onSubmit={handleAddTask} onClose={() => setShowModal(false)} />
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
