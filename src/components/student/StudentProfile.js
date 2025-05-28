import PropTypes from 'prop-types';
import { useNavigate, useNavigation } from 'react-router-dom';
import img1 from './stu.jpg';
import CourseSchedule from '../courses schudle/CourseSchedule';
export default function StudentProfile() {
    const navigate = useNavigate();
    const student =
    {
        name: "John Doe",
        email: "john.doe@gmail.com",
        phone: "1234567890",
        dob: "1990-01-01",
        studentType: "Manager",
        image: img1,  // Added image URL
        id: 1,
        global_info: "manger of website"
    }
    if (!student) {
        return <h2 className="text-center text-danger">No student Selected</h2>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4 rounded-lg" style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
                <img
                    src={student.image}
                    alt="Profile"
                    className="rounded-circle shadow"
                    style={{ width: "120px", height: "120px", objectFit: "cover", margin: "auto" }}
                />
                <h3 className="mt-3">{student.name}</h3>
                <p className="text-muted">{student.email}</p>
                <div className="mt-4">
                    <p><strong>Phone:</strong> {student.phone}</p>
                    <p><strong>Birth Date:</strong> {student.dob}</p>
                    <p><strong>Account Type:</strong> <span className="badge bg-primary">student</span></p>
                </div>
                <button
  className="btn mt-3"
  onClick={() => navigate(-1)}
  style={{
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
    color: '#fff',
    borderRadius: '8px',
    padding: '8px 16px',
    transition: 'all 0.3s ease',
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = '#FF7F00';
    e.target.style.borderColor = '#FF7F00';
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = '#1E3A5F';
    e.target.style.borderColor = '#1E3A5F';
  }}
>
  ← Go Back
</button>

            </div>
            {/* <CourseSchedule/> */}
        </div>
    );
}

StudentProfile.propTypes = {
    student: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        dob: PropTypes.string,
        studentType: PropTypes.string,
        image: PropTypes.string
    })
};
