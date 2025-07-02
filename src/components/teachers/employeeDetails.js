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
    <div className="container mt-4">
      <Card
        className="shadow rounded-4"
        style={{ background: "#0f1c2e", color: "#fff" }}
      >
        <Card.Body>
          <Row>
            <Col md={4} className="text-center mb-3">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "4px solid orange",
                  overflow: "hidden",
                  margin: "0 auto",
                  backgroundColor: "#eee",
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
              <h4 className="mt-3">{name}</h4>
              <p className="text-muted">ID: {id}</p>
            </Col>

            <Col md={8}>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Email:</strong>
                </Col>
                <Col sm={8}>{email}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Role:</strong>
                </Col>
                <Col sm={8}>{getRole(role_id)}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}>
                  <strong>Created At:</strong>
                </Col>
                <Col sm={8}>{new Date(created_at).toLocaleString()}</Col>
              </Row>
              {staff_info?.Description && (
                <Row>
                  <Col sm={4}>
                    <strong>Description:</strong>
                  </Col>
                  <Col sm={8}>{staff_info.Description}</Col>
                </Row>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
