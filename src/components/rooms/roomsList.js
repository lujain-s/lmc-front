import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Operations from "../back_component/Operations";
import { useQuery } from "@tanstack/react-query";

export default function RoomsList() {
  const { request } = Operations();
  const [fillter, setFillter] = useState("showRooms");
  const [showModal, setShowModal] = useState(false);
  const [isNew, setisNew] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [capacity, setCapacity] = useState("");
  const [numberOfRoom, setNumberOfRoom] = useState("");
  const { user } = Operations();
  const isAdmin = user?.role === "SuperAdmin" || false;
  const fetchRooms = async () => {
    try {
      const response = await request.get(`secretarya/${fillter}`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  };

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["rooms", fillter],
    queryFn: fetchRooms,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("Capacity", capacity);
      formData.append("NumberOfRoom", numberOfRoom);

      if (isNew) {
        await request.post("super-admin/addRoom", formData, {
          headers: { Accept: "application/json" },
        });
      } else {
        await request.post(
          `super-admin/updateRoom/${selectedRoomId}`,
          formData,
          {
            headers: { Accept: "application/json" },
          }
        );
      }
      setCapacity("");
      setNumberOfRoom("");
      setShowModal(false);
      setSelectedRoomId(null);
      refetch();
    } catch (err) {
      console.error(
        isNew ? "Failed to add room:" : "Failed to update room:",
        err
      );
    }
  };

  return (
    <div className="container py-4">
      {isAdmin && (
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
          onClick={() => {
            setShowModal(true);
            setisNew(true);
          }}
          aria-label="Add Room"
        >
          +
        </button>
      )}
      <h3 className="text-center mb-4" style={{ color: "#1E3A5F" }}>
        Rooms List
      </h3>
      <div className="flex gap-2">
        <button
          className={`btn btn-outline-primary ${
            fillter === "showRooms" ? "bg-primary text-light" : ""
          }`}
          onClick={() => setFillter("showRooms")}
        >
          All
        </button>
        <button
          className={`btn mx-2 btn-outline-primary ${
            fillter === "viewAvailableRooms" ? "bg-primary text-light" : ""
          }`}
          onClick={() => setFillter("viewAvailableRooms")}
        >
          Available
        </button>
        <button
          className={`btn btn-outline-primary ${
            fillter === "viewReservedRooms" ? "bg-primary text-light" : ""
          }`}
          onClick={() => setFillter("viewReservedRooms")}
        >
          Reserved
        </button>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ color: "#1E3A5F" }}>#</th>
            <th style={{ color: "#1E3A5F" }}>Room Number</th>
            <th style={{ color: "#1E3A5F" }}>Capacity</th>
            <th style={{ color: "#1E3A5F" }}>Status</th>
            <th style={{ color: "#1E3A5F" }}>Created At</th>
            {isAdmin && <th style={{ color: "#1E3A5F" }}>Actions</th>}{" "}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Loading...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="6" className="text-center text-danger">
                Error: {error?.message || "Failed to load rooms"}
              </td>
            </tr>
          ) : rooms.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No rooms found.
              </td>
            </tr>
          ) : (
            rooms.map((room, index) => (
              <tr key={room.id}>
                <td>{index + 1}</td>
                <td>{room.NumberOfRoom}</td>
                <td>{room.Capacity}</td>
                <td>
                  <span
                    className={`badge ${
                      room.Status === "Available"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {room.Status}
                  </span>
                </td>
                <td>{new Date(room.created_at).toLocaleString()}</td>
                {isAdmin && (
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => {
                        setShowModal(true);
                        setNumberOfRoom(room.NumberOfRoom);
                        setCapacity(room.Capacity);
                        setisNew(false);
                        setSelectedRoomId(room.id);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1E3A5F", color: "white" }}
        >
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Room Number</label>
              <input
                type="text"
                className="form-control"
                value={numberOfRoom}
                onChange={(e) => setNumberOfRoom(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Capacity</label>
              <input
                type="number"
                className="form-control"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>
            <div className="text-end">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#1E3A5F", color: "#fff" }}
              >
                Save Room
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
