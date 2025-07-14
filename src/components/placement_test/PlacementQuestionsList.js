import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { PiExamBold } from "react-icons/pi";
import UploadQuestions from "./UploadQuestions";
import { useNavigate } from "react-router-dom";
import Operations from "../back_component/Operations";
import AddQuestionModal from "./AddQuestionModal";

const PlacementQuestionsList = () => {
  const { request } = Operations();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await request.get("super-admin/getPTQuestionsWithAnswers");
      setQuestions(res.data || []);
    } catch (err) {
      setError("An error occurred while loading the questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div
      className="container min-vh-100 d-flex flex-column align-items-center bg-light pt-5"
      style={{ paddingBottom: "120px" }}
    >
      <h1
        className="text-center text-uppercase gap-2 pt-1 pb-5 mt-5"
        style={{
          letterSpacing: "5px",
          color: "#FF7F00",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        Placement Questions
      </h1>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <p className="text-danger">{error}</p>}

      <div className="row w-100">
        {questions.length === 0 && !loading && (
          <p className="text-muted text-center">No questions found.</p>
        )}

        {questions.map((question, index) => (
          <div key={question.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm p-3 h-100">
              <PiExamBold style={{ color: "#FF7F00", fontSize: "30px" }} />
              <h6 className="fw-bold mt-3">{question.QuestionText}</h6>
              <p>
                <strong>Section:</strong> {question.Section}
              </p>
              {question.answers && (
                <ul className="list-unstyled">
                  {question.answers.map((ans, idx) => (
                    <li
                      key={ans.id}
                      className={ans.isCorrect ? "text-success fw-bold" : ""}
                    >
                      {String.fromCharCode(65 + idx)}. {ans.AnswerText}
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="primary"
                size="sm"
                style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
                onClick={() => navigate(`/placement_test/${question.id}`)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* زر إضافة الأسئلة */}
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
        onClick={() => setShowAddModal(true)}
        aria-label="Upload Placement File"
      >
        +
      </button>
      {/* زر إضافة سؤال جديد (جنب زر الرفع) */}
      <button
        className="btn rounded-circle"
        style={{
          position: "fixed",
          bottom: "80px",
          right: "70px",
          width: "60px",
          height: "60px",
          fontSize: "26px",
          backgroundColor: "#FF6600",
          borderColor: "#FF6600",
          color: "#fff",
          boxShadow: "0 4px 8px #FF6600",
          zIndex: 1050,
          border: "none",
        }}
        onClick={() => setShowCreateModal(true)}
        aria-label="Add Question"
      >
        ?
      </button>

      <AddQuestionModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onAddSuccess={fetchQuestions}
      />
      <UploadQuestions
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onUploadSuccess={fetchQuestions}
      />
    </div>
  );
};

export default PlacementQuestionsList;
