import { useEffect, useState } from "react";
import Operations from "../back_component/Operations";
import AdsCard from "./announcementsCard";
import { useQuery } from "@tanstack/react-query";
import { Modal, Button, Form } from "react-bootstrap";
import Confirm from "../ui/confirmMessage";

export default function Announcements() {
  const { request } = Operations();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleted, setdeleted] = useState("");
  const [openDelete, setopenDelete] = useState("");

  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");
  const [Media, setMedia] = useState("");

  const fetchAds = async () => {
    const res = await request.get("getAllAnnouncements");
    return res.data.announcements;
  };

  const {
    data: adds = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adds"],
    queryFn: fetchAds,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedAd(null);
    setTitle("");
    setContent("");
    setMedia("");
    setShowModal(true);
  };

  const openEditModal = (ad) => {
    setIsEditing(true);
    setSelectedAd(ad);
    setTitle(ad.Title);
    setContent(ad.Content);
    setMedia(ad.Media);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("Content", Content);

    if (Media instanceof File) {
      formData.append("Media", Media);
    }
    setLoading(true);
    try {
      if (isEditing && selectedAd) {
        await request.post(
          `secretarya/updateAnnouncement/${selectedAd.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        formData.append("Media", Media); // في حالة الإضافة مطلوب دائمًا
        await request.post("secretarya/addAnnouncement", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // ✅ إعادة تعيين القيم بعد الإرسال
      setShowModal(false);
      setIsEditing(false);
      setSelectedAd(null);
      setTitle("");
      setContent("");
      setMedia("");
      refetch();
    } catch (err) {
      console.error("خطأ أثناء الإرسال:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await request.delete(`secretarya/deleteAnnouncement/${deleted}`);
      refetch();
      setopenDelete(false);
    } catch (err) {
      console.error("فشل الحذف:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center">{error.message}</div>;

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center py-4 container gap-3">
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
        onClick={openAddModal}
        aria-label="Add Announcement"
      >
        +
      </button>

      {adds.map((item) => (
        <AdsCard
          key={item.id}
          item={item}
          onEdit={openEditModal}
          onDelete={(id) => {
            setopenDelete(true);
            setdeleted(id);
          }}
        />
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "#fff" }}
        >
          <Modal.Title>
            {isEditing ? "تعديل الإعلان" : "إضافة إعلان جديد"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>العنوان</Form.Label>
              <Form.Control
                type="text"
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>المحتوى</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={Content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMedia(e.target.files[0])}
                required={!isEditing}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                {loading ? "Loading..." : isEditing ? "Save" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Confirm
        show={openDelete}
        title="Confirm deletion"
        message="Are you sure you want to delete this Announcement?"
        onSuccess={() => handleDelete()}
        onClose={() => setopenDelete(false)}
        loading={loading}
      />
    </div>
  );
}
