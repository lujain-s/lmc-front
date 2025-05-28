import { useState } from 'react';

export default function AddCourse() {
  const [course, setCourse] = useState({
    name: '',
    description: '',
    type: '',
    schedule: '',
    startDate: '',
    endDate: ''
  });

  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // محاكاة حفظ البيانات
    setTimeout(() => {
      console.log("📦 New Course Created:", course);
      setSuccess("Course added successfully!");
      setLoading(false);
    }, 1000);
  };



  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      {/* CSS خاص بالتركيز focus على الحقول */}
      <style>{`
        input.form-control:focus,
        select.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }
  
        label.form-label:focus-visible {
          box-shadow: 0 0 6px #FF7F00;
          outline: none;
          border-radius: 4px;
        }
      `}</style>
  
      <div className="row text-center mt-5 mb-2">
        <div className="col-lg-7 mx-auto">
          <h1 className="display-5" style={{ color: "#1E3A5F" }}>
            Add New Course
          </h1>
          <p className="lead mb-0" style={{ color: "#FF7F00" }}>
            Here you can add a new course
          </p>
          <hr />
        </div>
      </div>
  
      {success && (
        <div className="alert alert-success text-center" role="alert">
          {success}
        </div>
      )}
  
      {errors.general && (
        <div className="alert alert-danger text-center" role="alert">
          {errors.general}
        </div>
      )}
  
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow rounded-4 border-0">
            <div
              className="card-header text-center"
              style={{ backgroundColor: "#1E3A5F", color: "#fff" }}
            >
              <h3>Add Course</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {[
                  {
                    label: "Course Name",
                    name: "name",
                    type: "text",
                    value: course.name,
                    error: errors.name,
                    placeholder: "Enter course name",
                  },
                  {
                    label: "Course Type",
                    name: "type",
                    type: "text",
                    value: course.type,
                    error: errors.type,
                    placeholder: "e.g. Language, Science",
                  },
                  {
                    label: "Schedule",
                    name: "schedule",
                    type: "text",
                    value: course.schedule,
                    error: errors.schedule,
                    placeholder: "e.g. Mon & Wed, 10:00 - 12:00",
                  },
                ].map((field, idx) => (
                  <div className="mb-3 text-start" key={idx}>
                    <label
                      className="form-label"
                      tabIndex={0}
                      onFocus={(e) =>
                        (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.boxShadow = "none")
                      }
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.value}
                      onChange={handleChange}
                      className={`form-control rounded ${
                        field.error ? "is-invalid" : ""
                      }`}
                      placeholder={field.placeholder}
                      required
                    />
                    <div className="invalid-feedback">{field.error}</div>
                  </div>
                ))}
  
                {/* Description */}
                <div className="mb-3 text-start">
                  <label
                    className="form-label"
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={course.description}
                    onChange={handleChange}
                    className={`form-control rounded ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    rows="4"
                    placeholder="Enter a brief course description..."
                    required
                  ></textarea>
                  <div className="invalid-feedback">{errors.description}</div>
                </div>
  
                {/* Start Date */}
                <div className="mb-3 text-start">
                  <label
                    className="form-label"
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={course.startDate}
                    onChange={handleChange}
                    className={`form-control rounded ${
                      errors.startDate ? "is-invalid" : ""
                    }`}
                    required
                  />
                  <div className="invalid-feedback">{errors.startDate}</div>
                </div>
  
                {/* End Date */}
                <div className="mb-3 text-start">
                  <label
                    className="form-label"
                    tabIndex={0}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 6px #FF7F00")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={course.endDate}
                    onChange={handleChange}
                    className={`form-control rounded ${
                      errors.endDate ? "is-invalid" : ""
                    }`}
                    required
                  />
                  <div className="invalid-feedback">{errors.endDate}</div>
                </div>
  
                <button
                  type="submit"
                  className="w-100 rounded py-2 btn"
                  style={{
                    backgroundColor: "#1E3A5F",
                    color: "#fff",
                    transition:
                      "background-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF7F00";
                    e.currentTarget.style.boxShadow =
                      "0 0 12px rgba(255, 127, 0, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#1E3A5F";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Course"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }