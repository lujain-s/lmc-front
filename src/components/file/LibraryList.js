import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { PiBooksFill } from "react-icons/pi";
import AddLibrary from "./AddLibrary";
import Operations from "../back_component/Operations";
import Confirm from "../ui/confirmMessage";
import FilesModal from "./FilesModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const LibraryList = () => {
  const { request } = Operations();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [languageForFiles, setLanguageForFiles] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");


  const fetchLibraries = async () => {
    try {
      const res = await request.get("getLanguagesThatHaveLibrary");
      return res.data || [];
    } catch (err) {
      console.error("Error fetching libraries:", err);
      return [];
    }
  };

  const {
    data: libraries = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["libraries"],
    queryFn: fetchLibraries,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const handleCloseModal = () => {
    setShowAddModal(false);
    refetch();
  };

  const handleDeleteLibrary = async () => {
    setLoading(true);
    setErrorMessage("");
  
    if (!selectedLibrary?.languageId) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await request.get(
        `getLibraryByLanguage/${selectedLibrary.languageId}`
      );
      const libraryId = response.data?.id;
  
      if (!libraryId) {
        setLoading(false);
        return;
      }
  
      await request.delete(
        `secretarya/deleteLibraryForLanguage/${libraryId}`
      );
  
      setShowConfirm(false);
      queryClient.invalidateQueries(["libraries"]);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  

  const handleViewFiles = (library) => {
    setLanguageForFiles(library.id);
    setShowFilesModal(true);
  };

  const handleCloseFilesModal = () => {
    setShowFilesModal(false);
    setLanguageForFiles(null);
  };

  if (isLoading) return <p className="text-center mt-5">Loading libraries...</p>;
  if (isError) return <p className="text-danger text-center mt-5">{error?.message || "Error loading libraries"}</p>;

  return (
    <div
      className="container min-vh-100 d-flex flex-column align-items-center bg-light pt-5"
      style={{ paddingBottom: "120px" }}
    >
      <h1
        className="text-center text-uppercase gap-2 pt-1 pb-5 mt-5"
        style={{   letterSpacing: "5px",
          color: "#FF7F00",fontWeight: "bold", fontSize: "30px", }}
      >
        LMC LIBRARIES
      </h1>

      <div className="row w-100">
        {libraries.length === 0 && (
          <p className="text-center text-muted">No libraries found.</p>
        )}

        {libraries.map(({ id, Name, Description }) => (
          <div key={id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm text-center p-3 h-100">
              <PiBooksFill style={{ color: "#FF7F00", fontSize: "40px" }} />
              <h5 className="fw-bold mt-3">{Name}</h5>
              <p className="text-muted">{Description}</p>
              <div
                className="d-flex justify-content-end gap-1 mt-2"
                style={{ top: "10px", right: "10px" }}
              >
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
                  size="sm"
                  onClick={() => handleViewFiles({ id, Name })}
                >
                  View
                </Button>


                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedLibrary({ languageId: id, Name });
                    setShowConfirm(true);

                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Add New Library</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddLibrary onClose={handleCloseModal} onSuccess={refetch} />
        </Modal.Body>
      </Modal>

      
        <Confirm
          show={showConfirm}
          title="Confirm Deletion"
          message={`Are you sure you want to delete library "${selectedLibrary?.Name}"?`}
          onSuccess= {handleDeleteLibrary}
          onClose={() => setShowConfirm(false)}
          loading={loading}
          buttonText="Delete"
        />
     

      <FilesModal
        show={showFilesModal}
        onHide={handleCloseFilesModal}
        languageId={languageForFiles}
      />

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
        aria-label="Add Library"
      >
        +
      </button>

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

export default LibraryList;
