import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import AddEmployee from './AddEmployee';
import Operations from "../back_component/Operations";
import $ from 'jquery';
import { FaUser, FaEnvelope, FaIdBadge, FaImage, FaAlignLeft, FaCogs } from 'react-icons/fa';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const { request } = new Operations();
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // ✅ تفعيل البحث بعد تحميل البيانات
    $("#myInput").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  }, [employees]);



  const fetchEmployees = async () => {
    try {
      const res = await request.get('super-admin/getStaff');
      setEmployees(res.data.users);
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_NETWORK") {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: error.response?.data?.message || "Unknown error" });
      }
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      setEmployees(employees.filter(emp => emp.id !== id));
      // هنا يمكنك إضافة طلب حذف للباكند إذا أردت
    }
  };

 
  return (
    <div>
      {/* زر الإضافة العائم */}
      <button
        className="btn rounded-circle"
        style={{
          position: 'fixed',
          bottom: '60px',
          right: '30px',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          backgroundColor: '#1E3A5F',
          borderColor: '#1E3A5F',
          color: '#fff',
          boxShadow: '0 4px 8px #1E3A5F',
          zIndex: 1000,
          border: 'none'
        }}
        onClick={handleOpen}
      >
        +
      </button>
  
      <div className="pt-5 pb-5 mt-5">
        <h1 className="text-center text-uppercase" style={{ letterSpacing: "5px", color: "#FF7F00" }}>
          Employee List
        </h1>
        <br />
  
        <div className="container">
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}
          <p className="text-center">
            Type something in the input field to filter the table data, e.g. type (Employee Name) in search field...
          </p>
  
          <input
            className="form-control mb-4"
            id="myInput"
            type="text"
            placeholder=" Search ..."
          />
  
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
                    Role ID
                  </th>
                  <th style={{ color: "#1E3A5F" }}>
                    <FaImage className="me-2" />
                    Photo
                  </th>
                  <th style={{ color: "#1E3A5F" }}>
                    <FaAlignLeft className="me-2" />
                    Description
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
                    const photo = item['Other Info']?.Photo || '/default-profile.png';
                    const description = item['Other Info']?.Description || '';
  
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <NavLink to={`/profile/${item.id}`} className="text-decoration-none text-dark">
                            {item.name}
                          </NavLink>
                        </td>
                        <td>{item.email}</td>
                        <td>{item.role_id}</td>
                        <td>
                          <img
                            src={photo}
                            alt="Profile"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              boxShadow: "0 0 5px rgba(0,0,0,0.1)"
                            }}
                          />
                        </td>
                        <td>{description}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/edit-employee/${item.id}`}
                              className="btn btn-sm "
                              style={{
                                color:"#ffffff",
                                 backgroundColor: "#1E3A5F", 
                                 borderColor: "#1E3A5F" , 
                                 padding: '4px 10px',
                                 borderRadius: '4px'}}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No employees found.</td>
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
          <AddEmployee onSuccess={() => {
            handleClose();
            fetchEmployees();
          }} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
