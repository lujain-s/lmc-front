import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { PiTranslateBold } from "react-icons/pi";
import AddLanguagePage from "./AddLanguage";
import Operations from "../back_component/Operations";

import EditLanguageModal from "./EditLanguageModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Confirm from "../ui/confirmMessage";

const LanguageList = () => {
  const { request } = Operations();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const fetchLanguages = async () => {
    try {
      const res = await request.get("showAllLanguage");
      if (res.data.status === "success") {
        return res.data.data;
      }
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  const {
    data: languages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const handleCloseModal = () => {
    setShowModal(false);
    refetch();
  };

  const handleEdit = (language) => {
    setSelectedLanguage(language);
    setShowEditModal(true);
  };
  const handleDelete = async (languageId) => {
    setLoading(true);
    try {
      await request.delete(`super-admin/deleteLanguage/${languageId}`);
      setShowDeleteModal(false);

      queryClient.setQueryData(["languages"], (oldData) =>
        oldData?.filter((lang) => lang.id !== languageId)
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Deletion failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error}</p>;

  return (
    <div
      className="container min-vh-100 d-flex flex-column align-items-center bg-light pt-5"
      style={{ paddingBottom: "120px" }}
    >
      <h1
        className="text-center text-uppercase gap-2 pt-1 pb-5 mt-5"
        style={{ letterSpacing: "5px", color: "#FF7F00", fontSize: "30px" }}
      >
        LMC LANGUAGES
      </h1>
      <div className="row w-100">
        {languages.map(({ id, Name, Description }) => (
          <div key={id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm text-center p-3 h-100">
              <PiTranslateBold style={{ color: "#FF7F00", fontSize: "40px" }} />
              <h5 className="fw-bold mt-3">{Name}</h5>
              <p className="text-muted">{Description}</p>
              <div
                className="d-flex justify-content-end gap-1 mt-2"
                style={{ top: "10px", right: "10px" }}
              >
                <Button
                  style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
                  size="sm"
                  onClick={() => handleEdit({ id, Name, Description })}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedLanguage({ id });
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
        onClick={() => setShowModal(true)}
        aria-label="Add Language"
      >
        +
      </button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Add New Language</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddLanguagePage onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>

      <EditLanguageModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        language={selectedLanguage}
        onUpdated={refetch}
      />
      {showDeleteModal && (
        <Confirm
          show={showDeleteModal}
          title="Confirm deletion"
          message="Are you sure you want to delete this language?"
          onSuccess={() => handleDelete(selectedLanguage.id)}
          onClose={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}

      <style>{`
        .custom-btn {
          background-color: #1E3A5F;
          border-color: #1E3A5F;
          color: white;
        }
        .custom-btn:hover,
        .custom-btn:focus {
          background-color: #FF7F00 !important;
          border-color: #FF7F00 !important;
          color: white;
        }
        input.form-control:focus,
        textarea.form-control:focus {
        border-color: #FF7F00 !important;
        box-shadow: 0 0 8px #FF7F00 !important;
        outline: none;
       }
      `}</style>
    </div>
  );
};

export default LanguageList;
