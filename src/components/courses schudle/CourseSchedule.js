import { useState, useEffect } from 'react';
import $ from "jquery";
import { Link } from 'react-router-dom';
import AddCourse from './AddCourse'; // استيراد المكون AddCourse
import { Modal } from 'react-bootstrap';

export default function CourseSchedule() {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false); // لإظهار المودال
    const handleOpen = () => setShowModal(true);

    // بيانات الكورسات مع الصور
    const courseData = [
        {
            name: "Frensh",
            time: "10:00 AM - 12:00 PM",
            instructor: "John Doe",
            date: "2025-04-01",
            id: 1
        },
        {
            name: "Arabic",
            time: "2:00 PM - 4:00 PM",
            instructor: "Jane Smith",
            date: "2025-04-02",
            id: 2
        },
        {
            name: "Germany",
            time: "3:00 PM - 5:00 PM",
            instructor: "Michael Brown",
            date: "2025-04-03",
            id: 3
        },
        {
            name: "English",
            time: "5:30 PM - 7:30 PM",
            instructor: "Emily White",
            date: "2025-04-04",
            id: 4
        }
    ];

    useEffect(() => {
        setCourses(courseData);

        // تفعيل الفلترة عبر البحث
        $("#courseSearch").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#courseTable tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
    }, []);

    // توليد الصفوف الخاصة بالكورسات
    const CourseItems = () => {
        return courses.map((course, index) => (
            <tr key={course.id} style={{ transition: 'all 0.3s ease' }}>
                <td scope="row">{index + 1}</td>
                <td>
                    <div>
                        <div>
                            <h6 style={{ marginBottom: "5px" }}>{course.name}</h6>
                            <p style={{ marginBottom: "0px", fontWeight: "bold", color: "#007bff" }}>{course.instructor}</p>
                        </div>
                    </div>
                </td>
                <td>{course.time}</td>
                <td><h6 className='text-center'>{course.date}</h6></td>
                <td>class 1</td>
                <td>
                    <Link 
                    to={`/course-details/${course.id}`} 
                    className="btn btn-info"
                    style={{
                        backgroundColor: '#1E3A5F',
                        borderColor: '#1E3A5F',
                        padding: '4px 10px',
                        borderRadius: '4px',
                       
                         
                    }}
                    >
                        View Details
                    </Link>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <div className="pt-5 pb-5 mt-5">
                <h1 className="text-center text-uppercase" style={{ letterSpacing: "5px", color: "#FF7F00" }}>Course Schedule</h1>
                <br />
                <div className="container">
                    <p className="text-center">
                        Type something in the input field to filter the table data, e.g. type (course name) in search field...
                    </p>
                    <input className="form-control package-item mb-0" id="courseSearch" type="text" placeholder="Search..." />
                    <br />
    
                    <div className="table-responsive card2 p-0 container mt-4 p-5">
                        <table className="table mb-0 m-0 table-bordered table-striped">
                            <thead >
                                <tr>
                                    <th scope="col" style={{ color: "#1E3A5F" }}>#</th>
                                    <th scope="col" style={{ color: "#1E3A5F" }}>Course Name <i className='fa fa-book'></i></th>
                                    <th scope="col" style={{ color: "#1E3A5F" }}>Time <i className='fa fa-clock'></i></th>
                                    <th scope="col" style={{ color: "#1E3A5F" }}>Date <i className='fa fa-calendar'></i></th>
                                    <th scope="col" style={{ color: "#1E3A5F" }}>Place <i className='fa fa-home'></i></th>
                                    <th scope="col" style={{ color: "#1E3A5F" }}>Details <i className='fa fa-info-circle'></i></th>
                                </tr>
                            </thead>
                            <tbody id="courseTable">
                                <CourseItems />
                            </tbody>
                        </table>
                    </div>
    
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
                </div>
            </div>
    
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
    
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Body className="bg-darkblue ">
                    <AddCourse />
                </Modal.Body>
            </Modal>
        </div>
    );
}