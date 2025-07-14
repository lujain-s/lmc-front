import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import Operations from "../back_component/Operations";

const EditQuestionModal = ({ show, onHide, questionData, onEditSuccess }) => {
  const { request } = Operations();

  const [questionText, setQuestionText] = useState("");
  const [context, setContext] = useState("");
  const [section, setSection] = useState("Listening");
  const [answers, setAnswers] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (questionData) {
      setQuestionText(questionData.QuestionText || "");
      setContext(questionData.Context || "");
      setSection(questionData.Section || "Listening");
      setAnswers(questionData.answers || []);
      setMediaFile(null);
      setError("");
      setSuccess(false);
    }
  }, [questionData, show]);

  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers];
    updated[index][field] = field === "isCorrect" ? value === "true" : value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!questionText.trim() || answers.length !== 4) {
      setError("Please fill all required fields and ensure 4 answers.");
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
      await request.post(
        `super-admin/editPlacementTestQuestion/${questionData.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onHide();
      setSuccess(true);
      onEditSuccess();
      setTimeout(() => {
        onHide();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
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
        <Modal.Title>Edit Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ color: "#003366" }}>
          {success && (
            <Alert variant="success" className="text-center">
              تم التعديل بنجاح!
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Context</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Section</Form.Label>
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
          <h5>Answers</h5>
          {answers.map((ans, index) => (
            <div key={index} className="mb-3">
              <Form.Label>Answer {String.fromCharCode(65 + index)}</Form.Label>
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
              />
            </div>
          ))}

          <hr />
          <h5>Media</h5>

          {/* عرض الميديا الحالية أو المختارة حديثاً */}
          <div className="mb-3 text-center">
            {mediaFile ? (
              // عرض الميديا الجديدة المختارة
              mediaFile.type.startsWith("video/") ? (
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
                  alt="New Media"
                  width="210"
                  style={{
                    border: "1.5px solid #003366",
                    borderRadius: "15px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )
            ) : questionData?.Media ? (
              // عرض الميديا القديمة
              questionData.Media.endsWith(".mp4") ? (
                <video
                  controls
                  src={questionData.Media}
                  width="300"
                  className="border rounded"
                  style={{
                    borderColor: "#003366",
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                />
              ) : questionData.Media.endsWith(".mp3") ||
                questionData.Media.endsWith(".wav") ? (
                <audio controls src={questionData.Media} />
              ) : (
                <img
                  src={questionData.Media}
                  alt="Question Media"
                  width="210"
                  style={{
                    border: "1.5px solid #003366",
                    borderRadius: "15px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )
            ) : null}
          </div>
          <Form.Group>
            <Form.Label>Change Media (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="video/*,audio/*,image/*"
              onChange={(e) => setMediaFile(e.target.files[0])}
              disabled={loading}
            />
          </Form.Group>

          {error && <p className="text-danger fw-bold mt-3">{error}</p>}
        </div>
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
          {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditQuestionModal;
