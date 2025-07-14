import React, { useState } from "react";
import { Modal, Button, Spinner, Card, Row, Col } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import UploadFileModal from "./UploadFileModal";
import EditFileModal from "./EditFileModal";
import Confirm from "../ui/confirmMessage";

const FilesModal = ({ show, onHide, languageId }) => {
    const { request } = Operations();
    const queryClient = useQueryClient();
  
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    
  
    // حالات الحذف
    const [showConfirm, setShowConfirm] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
  
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["filesByLanguage", languageId],
      queryFn: async () => {
        if (!languageId) return null;
        const res = await request.get(`getFilesByLanguage/${languageId}`);
        return res.data || null;
      },
      enabled: !!languageId && show,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });



    const { data: libraryData, isLoading: loadingLibrary } = useQuery({
      queryKey: ["libraryByLanguage", languageId],
      queryFn: async () => {
        const res = await request.get(`getLibraryByLanguage/${languageId}`);
        return res.data;
      },
      enabled: !!languageId && show,
    });
    







  
    const files = data?.files || [];
  
  
    // فتح مودال التأكيد قبل الحذف
    const confirmDeleteFile = (file) => {
      setFileToDelete(file);
      setDeleteError("");
      setShowConfirm(true);
    };
  
    // تنفيذ الحذف بعد التأكيد
    const handleDeleteFile = async () => {
      if (!fileToDelete) return;
      setDeleting(true);
      setDeleteError("");
      try {
        await request.delete(`secretarya/deleteFileInLibrary/${fileToDelete.id}`);
        queryClient.invalidateQueries(["filesByLanguage", languageId]);
        setShowConfirm(false);
        setFileToDelete(null);
      } catch (err) {
        setDeleteError(err.response?.data?.message || "Failed to delete file");
      } finally {
        setDeleting(false);
      }
    };

    const downloadFile = (fileId) => {
      const link = document.createElement('a');
      link.href = `http://localhost:8000/api/downloadFile/${fileId}`;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    
    
    const openEditModal = (file) => {
      setSelectedFile(file);
      setShowEditModal(true);
    };
  
    return (
      <>
        <Modal show={show} onHide={onHide} centered size="lg">
          <Modal.Header closeButton style={{ backgroundColor: "#1E3A5F", color: "white" }}>
            <Modal.Title>Files for Language: {data?.language || languageId}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ position: "relative", minHeight: "300px" }}>
            {isLoading && (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading files...</p>
              </div>
            )}
  
            {isError && <p className="text-danger">Error: {error?.message || "Failed to load files."}</p>}
  
            {!isLoading && !isError && files.length === 0 && (
              <p className="text-muted text-center">No files found for this language.</p>
            )}
  
            {!isLoading && !isError && files.length > 0 && (
              <Row xs={1} md={2} className="g-3">
                {files.map((file) => (
                  <Col key={file.id}>
                  <Card>
          <Card.Body>
            <Card.Text>
              <strong>file_name:</strong> {file.file_name}
            </Card.Text>
            <Card.Text>
              <strong>description:</strong> {file.description}
            </Card.Text>

            {/* <Button
              variant="primary"
              href={file.url}
ؤؤ              target="_blank"
              rel="noopener noreferrer"
              className="me-2"
              size="sm"
            >
              View
            </Button> */}

            <Button
              variant="warning"
              style={{ backgroundColor: "#ff7f00", borderColor: "#ff7f00" }}
              size="sm"
              className="me-2 text-white"
              onClick={() => openEditModal(file)}
            >
              Edit
            </Button>

            <Button
              variant="danger"
              size="sm"
              className="me-2" 
              onClick={() => confirmDeleteFile(file)}
              disabled={deleting}
            >
              {deleting && fileToDelete?.id === file.id ? "Deleting..." : "Delete"}
            </Button>

            {/* 
            <Button
             variant="success"
             style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
             className="me-2"
             size="sm"
              onClick={() => window.open(`http://localhost:8000/api/downloadFile/${file.id}`, "_blank")} 
             >
             Download
             </Button> */}
 
             <Button
             variant="success"
             className="me-2"
             size="sm"
             style={{ backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" }}
             onClick={() => downloadFile(file.id)}
             >
              Download
            </Button>


          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
)}
  
            {deleteError && <p className="text-danger mt-3">{deleteError}</p>}
  
            <button
              className="btn rounded-circle"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "30px",
                width: "50px",
                height: "60px",
                fontSize: "30px",
                backgroundColor: "#1E3A5F",
                borderColor: "#1E3A5F",
                color: "#fff",
                boxShadow: "0 4px 8px #1E3A5F",
                zIndex: 1050,
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setShowUploadModal(true)}
              aria-label="Add File"
            >
              +
            </button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    



        {showUploadModal && libraryData?.id && (
  <UploadFileModal
    show={showUploadModal}
    onHide={() => setShowUploadModal(false)}
    libraryId={libraryData.id}
    onUploadSuccess={() => {
      queryClient.invalidateQueries(["filesByLanguage", languageId]);
      setShowUploadModal(false);
    }}
  />
)}

  
        {selectedFile && (
          <EditFileModal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            fileData={selectedFile}
            onEditSuccess={() => {
              queryClient.invalidateQueries(["filesByLanguage", languageId]);
              setShowEditModal(false);
            }}
          />
        )}


        <Confirm
          show={showConfirm}
          title="Confirm Delete"
          message={`Are you sure you want to delete the file "${fileToDelete?.Description || fileToDelete?.file_name}"?`}
          loading={deleting}
          onSuccess={handleDeleteFile}
          onClose={() => setShowConfirm(false)}
          buttonText="Delete"
        />
      </>
    );
  };
  
  function file_url(path) {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000/storage/${path}`;
  }
  
  export default FilesModal;