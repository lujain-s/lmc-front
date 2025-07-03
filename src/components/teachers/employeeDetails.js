import { useQuery } from "@tanstack/react-query";
import Operations from "../back_component/Operations";
import { Spinner, Alert, Card, Row, Col, Image } from "react-bootstrap";
import { getRole } from "../back_component/utils";

export default function EmployeeDetails({ id, isDeleted = false }) {
  const { request } = Operations();

  const fetchData = async () => {
    const res = await request.get(
      `super-admin/showEmployee/${id}${isDeleted ? "?with_trashed=1" : ""}`
    );
    return res.data.employee;
  };

  const {
    data: employee,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Spinner animation="border" variant="warning" />;
  if (isError) return <Alert variant="danger">{error.message}</Alert>;

  const { name, email, created_at, role_id, staff_info } = employee;
  const photo = staff_info?.Photo || "/default-profile.png"; // وضع صورة افتراضية

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "30px auto",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 4px 24px rgba(30,58,95,0.10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#1E3A5F",
          color: "#fff",
          padding: "20px 0 12px 0",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Employee Details
      </div>
      <div style={{ padding: "24px" }}>
        <div className="text-center mb-3">
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "4px solid #FF7F00",
              overflow: "hidden",
              margin: "0 auto",
              backgroundColor: "#eee",
              boxShadow: "0 2px 8px rgba(30,58,95,0.10)",
            }}
          >
            <Image
              src={photo || "/default-avatar.png"}
              alt="Employee Photo"
              width={100}
              height={100}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <h4 className="mt-3" style={{ color: "#1E3A5F", fontWeight: 700 }}>
            {name}
          </h4>
          <p className="text-muted" style={{ fontSize: "0.95rem" }}>
            ID: {id}
          </p>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <strong style={{ color: "#1E3A5F" }}>Email:</strong>{" "}
          <span style={{ color: "#222" }}>{email}</span>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <strong style={{ color: "#1E3A5F" }}>Role:</strong>{" "}
          <span style={{ color: "#222" }}>{getRole(role_id)}</span>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <strong style={{ color: "#1E3A5F" }}>Created At:</strong>{" "}
          <span style={{ color: "#222" }}>
            {new Date(created_at).toLocaleString()}
          </span>
        </div>
        {staff_info?.Description && (
          <div style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#1E3A5F" }}>Description:</strong>{" "}
            <span style={{ color: "#222" }}>{staff_info.Description}</span>
          </div>
        )}
      </div>
    </div>
  );
}
