import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Modal } from "react-bootstrap";
import AddEmployee from "./AddEmployee";
import Operations from "../back_component/Operations";
import $ from "jquery";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaImage,
  FaAlignLeft,
  FaCogs,
  FaTrash,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Confirm from "../ui/confirmMessage";
import { getRole } from "../back_component/utils";
import { toast } from "react-toastify";
import EmployeeDetails from "./employeeDetails";

export default function EmployeeList() {
  //const [employees, setEmployees] = useState([]);  //*****not used this state after use react quiry */
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [actionId, setActionId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fillter, setFillter] = useState("all");
  const { request } = Operations();
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  //fetch employees using react quiry
  const fetchEmployees = async () => {
    const res = await request.get(
      `super-admin/showAllEmployees${fillter ? `?filter=${fillter}` : ""}`
    );
    return res.data.employees;
  };

  //data from react quiry after fetch
  const {
    data: employees = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employees", fillter],
    queryFn: fetchEmployees,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handler = function () {
      var value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    };

    $("#myInput").on("keyup", handler);

    return () => {
      $("#myInput").off("keyup", handler);
    };
  }, [employees]);
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await request.delete(`super-admin/destroyEmployee/${id}`);
      toast.success("Employee deleted successfuly!");
      setShowDeleteModal(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleRestore = async (id) => {
    try {
      setLoading(true);
      await request.post(`super-admin/restoreEmployee/${id}`);
      toast.success("Employee restored successfuly!");
      setShowRestoreModal(false);
      refetch(); // إعادة جلب البيانات لتحديث القائمة
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore employee!");
    } finally {
      setLoading(false);
    }
  };
  const handleView = (id) => {
    console.log("view:", id);
    setShowEmployeeModal(true);
    setActionId(id);
  };

  return (
    <div>
      {/* زر الإضافة العائم */}
      <button
        className="btn rounded-circle"
        style={{
          position: "fixed",
          bottom: "60px",
          right: "30px",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          backgroundColor: "#1E3A5F",
          borderColor: "#1E3A5F",
          color: "#fff",
          boxShadow: "0 4px 8px #1E3A5F",
          zIndex: 1000,
          border: "none",
        }}
        onClick={handleOpen}
      >
        +
      </button>

      <div className="pt-5 pb-5 mt-5">
        <h1
          className="text-center text-uppercase"
          style={{ letterSpacing: "5px", color: "#FF7F00" }}
        >
          Employee List
        </h1>
        <br />

        <div className="container">
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}
          <p className="text-center">
            Type something in the input field to filter the table data, e.g.
            type (Employee Name) in search field...
          </p>

          <input
            className="form-control mb-4"
            id="myInput"
            type="text"
            placeholder=" Search ..."
          />
          <div className="flex my-4 gap-4">
            <button
              className={` button-blue  ${
                fillter === "all" ? "button-orange" : ""
              }`}
              onClick={() => setFillter("all")}
            >
              All
            </button>
            <button
              className={`button-blue mx-2 ${
                fillter === "active" ? "button-orange" : ""
              }`}
              onClick={() => setFillter("active")}
            >
              Active
            </button>
            <button
              className={` button-blue ${
                fillter === "only_deleted" ? "bg-orange" : ""
              }`}
              onClick={() => setFillter("only_deleted")}
            >
              Deleted
            </button>
          </div>
          {/* الجدول مع الأيقونات والمسافة العلوية */}
          <div className="table-responsive card2 p-0 container mt-5">
            <table className="table mb-0 table-bordered table-striped">
              <thead className="align-middle">
                <tr>
                  <th>#</th>
                  <th style={{ color: "#1E3A5F" }}>
                    <FaUser className="me-2" />
                    Employee Name
                  </th>
                  <th style={{ color: "#1E3A5F" }}>
                    <FaEnvelope className="me-2" />
                    Email
                  </th>
                  <th style={{ color: "#1E3A5F" }}>
                    <FaIdBadge className="me-2" />
                    Role
                  </th>
                  <th style={{ color: "#1E3A5F" }}>
                    <FaCogs className="me-2" />
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody id="myTable">
                {employees.length > 0 ? (
                  employees.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <NavLink
                            to={`/profile/${item.id}`}
                            className="text-decoration-none text-dark"
                          >
                            {item.name}
                          </NavLink>
                        </td>
                        <td>{item.email}</td>
                        <td>{getRole(item.role_id)}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => {
                                setActionId(item.id);
                                setShowDeleteModal(true);
                              }}
                              className="btn btn-danger btn-sm"
                            >
                              <FaTrash />
                            </button>
                            {fillter === "only_deleted" && (
                              <button
                                onClick={() => {
                                  setActionId(item.id);
                                  setShowRestoreModal(true);
                                }}
                                className="button-blue"
                              >
                                Restore
                              </button>
                            )}
                            <button
                              onClick={() => handleView(item.id)}
                              className="button-blue"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : isError ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      {error}
                    </td>
                  </tr>
                ) : isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* تحسين ستايل الفورم عند التركيز */}
      <style>
        {`
          input.form-control:focus,
          select.form-control:focus,
          textarea.form-control:focus {
            border-color: #FF7F00 !important;
            box-shadow: 0 0 8px #FF7F00 !important;
            outline: none;
          }
        `}
      </style>

      {/* نافذة إضافة موظف */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Body className="bg-darkblue">
          <AddEmployee
            onSuccess={() => {
              handleClose();
              refetch();
            }}
          />
        </Modal.Body>
      </Modal>
      {showDeleteModal && (
        <Confirm
          show={showDeleteModal}
          loading={loading}
          title="Confirm deletion"
          message="Are you sure you want to delete this employee?"
          onSuccess={() => handleDelete(actionId)}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showRestoreModal && (
        <Confirm
          show={showRestoreModal}
          loading={loading}
          title="Confirm Restoration"
          message="Are you sure you want to restore this employee?"
          onSuccess={() => handleRestore(actionId)}
          onClose={() => setShowRestoreModal(false)}
          buttonText="Restore"
        />
      )}
      {showEmployeeModal && (
        <Modal
          show={showEmployeeModal}
          onHide={() => setShowEmployeeModal(false)}
          size="l"
          centered
          dialogClassName="transparent-modal"
        >
          <Modal.Body
            style={{ background: "transparent", boxShadow: "none", padding: 0 }}
          >
            <EmployeeDetails
              id={actionId}
              isDeleted={fillter === "only_deleted"}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
