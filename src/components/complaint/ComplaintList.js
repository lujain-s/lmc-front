import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Operations from '../back_component/Operations';
import { data } from 'jquery';

export default function ComplaintList() {
    const [complaints, setComplaints] = useState([]);
    const { request } = Operations();


    useEffect(() => {
        request.get('super-admin/showAllComplaint').then((res) => {
            //setError("");
            setComplaints(res.data.data);
            console.log(res)
        }).catch(function (error) {
            console.log(error);
            console.error('Failed to fetch complaints:', error);

        });
        const handleSearch = () => {
            const value = document.getElementById("complaintSearch").value.toLowerCase();
            const rows = document.querySelectorAll("#complaintTable tr");
            rows.forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(value) ? "" : "none";
            });
        };

        const input = document.getElementById("complaintSearch");
        if (input) input.addEventListener("keyup", handleSearch);
        return () => {
            if (input) input.removeEventListener("keyup", handleSearch);
        };
    }, []);

    const renderStatusBadge = (status) => {
        const color = status.toLowerCase() === 'pending' ? 'warning' : 'success';
        return <span className={`badge bg-${color}`}>{status}</span>;
    };

    return (
        <div className="pt-5 pb-5 mt-5">
            <h1 className="text-center text-uppercase" style={{ letterSpacing: "5px" , color: "#FF7F00"}}>Complaint List</h1>
            <br />
            <div className="container">

            <p className="text-center">
            Type something in the input field to filter the table data, e.g. type (Teacher Name) in search field...
          </p>
  
                <input
                    className="form-control"
                    id="complaintSearch"
                    type="text"
                    placeholder="Search ..."
                />
                <br />
                <div className="table-responsive card2 p-0 container mt-4">
                    <table className="table mb-0 table-bordered table-striped">
                        <thead>
                            <tr>
                                <th style={{ color: "#1E3A5F" }}># </th>
                                <th style={{ color: "#1E3A5F" }}>Teacher Name <i className="fa fa-user"></i></th>
                                <th style={{ color: "#1E3A5F" }}>Teacher Email <i className="fa fa-envelope"></i>                                </th>
                                <th style={{ color: "#1E3A5F" }}>Date <i className="fa fa-calendar-alt"></i></th>
                                <th style={{ color: "#1E3A5F" }}>Status <i className="fa fa-info-circle"></i></th>
                                <th style={{ color: "#1E3A5F" }}>Details <i className="fa fa-eye"></i></th>
                            </tr>
                        </thead>
                        <tbody id="complaintTable">
                            {complaints.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.teacher?.name}</td>
                                    <td>{item.teacher?.email}</td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>{renderStatusBadge(item.status)}</td>
                                    <td>
                                        <Link
                                            to={`/complaint-details/${item.id}`}
                                            className="btn btn-sm"
                                            style={{
                                              color: "#fff",
                                              backgroundColor: '#1E3A5F',
                                              padding: '4px 10px',
                                              borderRadius: '4px',
                                                 }}
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {complaints.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">No complaints found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                </div>
            </div>
        </div>
    );
}
