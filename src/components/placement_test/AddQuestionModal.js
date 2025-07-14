import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import Operations from "../back_component/Operations";

const AddQuestionModal = ({ show, onHide, onAddSuccess }) => {
  const { request } = Operations();

  const [questionText, setQuestionText] = useState("");
  const [context, setContext] = useState("");
  const [section, setSection] = useState("Listening");
  const [answers, setAnswers] = useState([
    { AnswerText: "", isCorrect: false },
    { AnswerText: "", isCorrect: false },
    { AnswerText: "", isCorrect: false },
    { AnswerText: "", isCorrect: false },
  ]);
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers];
    updated[index][field] = field === "isCorrect" ? value === "true" : value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (
      !questionText.trim() ||
      answers.length !== 4 ||
      answers.some((a) => !a.AnswerText.trim())
    ) {
      setError(
        "Please fill all required fields and ensure 4 complete answers."
      );
      return;
    }
    if (!answers.some((a) => a.isCorrect)) {
      setError("Please select one correct answer.");
      return;
    }

    const formData = new FormData();
    formData.append("QuestionText", questionText);
    formData.append("Context", context);
    formData.append("Section", section);
    answers.forEach((ans, index) => {
      formData.append(`Answers[${index}][AnswerText]`, ans.AnswerText);
      formData.append(`Answers[${index}][isCorrect]`, ans.isCorrect ? 1 : 0);
    });
    if (mediaFile) formData.append("Media", mediaFile);

    setLoading(true);
    try {
      await request.post("super-admin/addPlacementTestQuestion", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      onAddSuccess();
      setTimeout(() => {
        onHide();
        setSuccess(false);
        // reset fields
        setQuestionText("");
        setContext("");
        setSection("Listening");
        setAnswers([
          { AnswerText: "", isCorrect: false },
          { AnswerText: "", isCorrect: false },
          { AnswerText: "", isCorrect: false },
          { AnswerText: "", isCorrect: false },
        ]);
        setMediaFile(null);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#1E3A5F", color: "white" }}
      >
        <Modal.Title>Add New Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && (
          <Alert variant="success" className="text-center">
            تمت إضافة السؤال بنجاح ✅
          </Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label style={{ color: "#003366" }}>Question Text</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ color: "#003366" }}>Context</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ color: "#003366" }}>Section</Form.Label>
          <Form.Select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            disabled={loading}
          >
            <option value="Listening">Listening</option>
            <option value="Reading">Reading</option>
            <option value="LanguageUse">LanguageUse</option>
          </Form.Select>
        </Form.Group>

        <hr />
        <h5 style={{ color: "#003366" }}>Answers</h5>
        {answers.map((ans, index) => (
          <div key={index} className="mb-3">
            <Form.Label style={{ color: "#003366" }}>
              Answer {String.fromCharCode(65 + index)}
            </Form.Label>
            <Form.Control
              type="text"
              className="mb-2"
              value={ans.AnswerText}
              onChange={(e) =>
                handleAnswerChange(index, "AnswerText", e.target.value)
              }
              disabled={loading}
            />
            <Form.Check
              inline
              label="Correct"
              type="radio"
              name="correctAnswer"
              value="true"
              checked={ans.isCorrect === true}
              onChange={() =>
                setAnswers((prev) =>
                  prev.map((a, i) => ({ ...a, isCorrect: i === index }))
                )
              }
              disabled={loading}
              style={{ color: "#003366" }}
            />
            <style>{`
        input.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }
      `}</style>
          </div>
        ))}

        <hr />
        <h5 style={{ color: "#003366" }}>Media</h5>
        <Form.Group>
          <Form.Label style={{ color: "#003366" }}>
            Choose Media (optional)
          </Form.Label>
          <Form.Control
            type="file"
            accept="video/*,audio/*,image/*"
            onChange={(e) => setMediaFile(e.target.files[0])}
            disabled={loading}
          />
          {mediaFile && (
            <div className="text-center mt-3">
              {mediaFile.type.startsWith("video/") ? (
                <video
                  controls
                  src={URL.createObjectURL(mediaFile)}
                  width="300"
                  className="border rounded"
                  style={{
                    borderColor: "#003366",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                />
              ) : mediaFile.type.startsWith("audio/") ? (
                <audio controls src={URL.createObjectURL(mediaFile)} />
              ) : (
                <img
                  src={URL.createObjectURL(mediaFile)}
                  alt="Selected Media"
                  width="210"
                  style={{
                    border: "1.5px solid #003366",
                    borderRadius: "15px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )}
            </div>
          )}
        </Form.Group>

        {error && <p className="text-danger fw-bold mt-3">{error}</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Add Question"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddQuestionModal;
