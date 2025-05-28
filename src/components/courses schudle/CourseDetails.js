import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudentList from '../student/StudentList';
import { Modal, Form, Button } from "react-bootstrap";


export default function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [showForm, setShowForm] = useState(false); // 🆕 حالة للتحكم بظهور الفورم
    const [newLesson, setNewLesson] = useState({
        title: "",
        description: "",
        date: ""
    });

    const courseData = [
        {
            id: 1,
            name: "French",
            description: "Basic French course for beginners.",
            type: "Language",
            schedule: "Mon & Wed, 10:00 - 12:00",
            startDate: "2025-04-01",
            endDate: "2025-06-01",
            lessons: [
                { lessonId: 101, title: "Introduction to French", description: "Basic phrases and greetings.", date: "2025-04-01" },
                { lessonId: 102, title: "French Alphabet", description: "Learn the alphabet and pronunciation.", date: "2025-04-03" }
            ]
        },
        {
            id: 2,
            name: "Arabic",
            description: "Learn the Arabic language.",
            type: "Language",
            schedule: "Tue & Thu, 1:00 - 3:00",
            startDate: "2025-05-01",
            endDate: "2025-07-01",
            lessons: [
                { lessonId: 103, title: "Introduction to Arabic", description: "Basic phrases in Arabic.", date: "2025-05-01" }
            ]
        }
    ];

    useEffect(() => {
        const foundCourse = courseData.find(course => course.id === parseInt(id));
        setCourse(foundCourse);
    }, [id]);

    if (!course) {
        return <div>Loading...</div>;
    }

    const handleAddLesson = () => {
        const nextId = course.lessons.length + 100;
        const lessonToAdd = {
            lessonId: nextId,
            ...newLesson
        };
        setCourse(prev => ({
            ...prev,
            lessons: [...prev.lessons, lessonToAdd]
        }));
        setNewLesson({ title: "", description: "", date: "" });
        setShowForm(false); // إخفاء الفورم بعد الإضافة
    };

    return (
        <div className="container py-5">
          <div className="row text-center mt-5 mb-2">
            <div className="col-lg-7 mx-auto">
              <h1 className="display-5">Course Details: {course.name}</h1>
              <p className="lead mb-0">Here you can see the details of the course and add new lessons</p>
              <hr />
            </div>
          </div>
      
          <div className="row justify-content-center">
            <div className="col-md-9">
              <div className="card shadow mb-4">
                <div className="card-header bg-dark text-warning">
                  <h3>Course Information</h3>
                </div>
                <div className="card-body text-darkblue">
                  <p><strong>Type:</strong> {course.type}</p>
                  <p><strong>Description:</strong> {course.description}</p>
                  <p><strong>Schedule:</strong> {course.schedule}</p>
                  <p><strong>Date Range:</strong> {course.startDate} to {course.endDate}</p>
                </div>
              </div>
      
              <div className="card shadow mb-4">
                <div className="card-header bg-dark text-warning">
                  <h4>Lessons</h4>
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {course.lessons.map((lesson) => (
                      <li key={lesson.lessonId} className="list-group-item">
                        <strong>{lesson.title}</strong> – {lesson.date}
                        <p>{lesson.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
      
              <StudentList />
      
              {/* زر عائم لفتح المودال */}
              <button
                className="btn rounded-circle"
                style={{
                  position: "fixed",
                  bottom: "95px",
                  right: "20px",
                  width: "60px",
                  height: "60px",
                  fontSize: "28px",
                  backgroundColor: "#FF7F00",
                  color: "#fff",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowForm(true)}
                title="Add Lesson"
              >
                +
              </button>
      
              {/* Modal لإضافة درس جديد */}
              <style>{`
                .custom-btn {
                  background-color: #1E3A5F;
                  border-color: #1E3A5F;
                  color: white;
                  transition: background-color 0.3s ease;
                }
                .custom-btn:hover,
                .custom-btn:focus {
                  background-color: #FF7F00 !important;
                  border-color: #FF7F00 !important;
                  color: white;
                }
                .custom-btn:active {
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
      
              <Modal show={showForm} onHide={() => setShowForm(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#1E3A5F", color: "white" }}>
                  <Modal.Title>Add New Lesson</Modal.Title>
                </Modal.Header>
      
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="lessonTitle">
                      <Form.Label>Lesson Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter lesson title..."
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        required
                      />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="lessonDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter lesson description..."
                        value={newLesson.description}
                        onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                      />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="lessonDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={newLesson.date}
                        onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
      
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button className="custom-btn" onClick={handleAddLesson}>
                    Add Lesson
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      );
      
}
