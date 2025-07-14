import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Button, Form, Modal } from "react-bootstrap";
import Operations from "../back_component/Operations";
import Confirm from "../ui/confirmMessage";
import EditQuestionModal from "./EditQuestionModal";

const PlacementQuestionDetails = () => {
  const { request } = Operations();
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editData, setEditData] = useState({
    QuestionText: "",
    Context: "",
    Section: "Listening",
  });

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await request.get(`super-admin/getPTQuestion/${id}`);
      setQuestion(res.data);
      setEditData({
        QuestionText: res.data.QuestionText,
        Context: res.data.Context || "",
        Section: res.data.Section || "Listening",
      });
    } catch (err) {
      setError("Failed to load question.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCorrect = async (answerId) => {
    try {
      const res = await request.post(
        `super-admin/markCorrectAnswer/${answerId}`
      );
      fetchQuestion();
    } catch (err) {
      console.error(err);
      alert("Failed to mark correct answer.");
    }
  };

  const handleMediaUpload = async () => {
    if (!mediaFile) return;
    const formData = new FormData();
    formData.append("Media", mediaFile);
    setUploading(true);
    try {
      const res = await request.post(
        `super-admin/addOrUpdatePTMedia/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMediaFile(null);
      fetchQuestion();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await request.post(
        `super-admin/editPlacementTestQuestion/${id}`,
        editData
      );
      alert("Question updated successfully");
      setShowEditModal(false);
      fetchQuestion();
    } catch (err) {
      console.error(err);
      alert("Failed to update question");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await request.delete(`super-admin/deletePlacementTestQuestion/${id}`);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete question");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <p className="text-danger">{error}</p>;
  if (!question) return <p>Question not found.</p>;

  return (
    <div className="container py-5">
      <h3 className="mb-4" style={{ color: "#FF6600" }}>
        {question.QuestionText}
      </h3>
      <p>
        <strong style={{ color: "#003366" }}>Section:</strong>{" "}
        {question.Section}
      </p>
      {question.Context && (
        <p>
          <strong style={{ color: "#003366" }}>Context:</strong>{" "}
          {question.Context}
        </p>
      )}

      <h5 className="mt-4" style={{ color: "#003366" }}>
        {" "}
        <strong>Answers</strong>
      </h5>
      <ul className="list-group mb-4">
        {question.answers.map((ans, idx) => (
          <li
            key={ans.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              ans.isCorrect ? "list-group-item-success" : ""
            }`}
          >
            <span>
              {String.fromCharCode(65 + idx)}. {ans.AnswerText}
            </span>
            <Button
              variant={ans.isCorrect ? "outline-danger" : "outline-success"}
              size="sm"
              onClick={() => handleMarkCorrect(ans.id)}
            >
              {ans.isCorrect ? "Unmark" : "Mark as Correct"}
            </Button>
          </li>
        ))}
      </ul>

      <Form.Group className="mb-3" style={{ color: "#003366" }}>
        <Form.Label>
          <strong>Media</strong>
        </Form.Label>

        {question.Media && (
          <div className="mb-3 text-center">
            {question.Media.endsWith(".mp4") ? (
              <video
                controls
                src={question.Media}
                width="300"
                className="border rounded"
                style={{
                  borderColor: "#003366",
                  borderWidth: "3px",
                  borderStyle: "solid",
                }}
              />
            ) : question.Media.endsWith(".mp3") ||
              question.Media.endsWith(".wav") ? (
              <audio controls src={question.Media} />
            ) : (
              <img
                src={question.Media}
                alt="Question Media"
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

        <Form.Control
          type="file"
          accept="video/*,audio/*,image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setMediaFile(file);
            const formData = new FormData();
            formData.append("Media", file);
            setUploading(true);
            try {
              const res = await request.post(
                `super-admin/addOrUpdatePTMedia/${id}`,
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              // alert(res.data.message || "تم رفع الوسائط بنجاح ✅");
              fetchQuestion();
            } catch (err) {
              alert("Media upload failed.");
              console.error(err);
            } finally {
              setUploading(false);
            }
          }}
        />
      </Form.Group>
      <div className="mt-5 d-flex justify-content-center gap-3">
        <Button
          style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
          onClick={() => setShowEditModal(true)}
        >
          {" "}
          Edit Question
        </Button>
        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
          Delete Question
        </Button>
        <Button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#FF6600",
            borderColor: "#FF6600",
            color: "white",
          }}
        >
          {" "}
          Back
        </Button>
      </div>

      {/* مودال التعديل */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label style={{ color: "#003366" }}>Question Text</Form.Label>
            <Form.Control
              type="text"
              value={editData.QuestionText}
              onChange={(e) =>
                setEditData({ ...editData, QuestionText: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label style={{ color: "#003366" }}>Context</Form.Label>
            <Form.Control
              type="text"
              value={editData.Context}
              onChange={(e) =>
                setEditData({ ...editData, Context: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label style={{ color: "#003366" }}>Section</Form.Label>
            <Form.Select
              value={editData.Section}
              onChange={(e) =>
                setEditData({ ...editData, Section: e.target.value })
              }
            >
              <option value="Listening">Listening</option>
              <option value="Reading">Reading</option>
              <option value="LanguageUse">LanguageUse</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        input.form-control:focus,
        textarea.form-control:focus {
          border-color: #FF7F00 !important;
          box-shadow: 0 0 8px #FF7F00 !important;
          outline: none;
        }
      `}</style>
      {/* مودال تأكيد الحذف */}
      <Confirm
        show={showDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        onClose={() => setShowDeleteConfirm(false)}
        onSuccess={handleDelete}
        loading={deleting}
        buttonText="Delete"
      />
      <EditQuestionModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        questionData={question}
        onEditSuccess={fetchQuestion}
      />
    </div>
  );
};

export default PlacementQuestionDetails;
