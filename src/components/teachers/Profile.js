import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Operations from "../back_component/Operations";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const { request } = new Operations();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await request.get("super-admin/showUserInfo/1");
        setProfile(res.data);
      } catch (error) {
        console.error("erorr is:", error);
        const msg =
          error.code === "ERR_NETWORK"
            ? "ERR_NETWORK: " + error.message
            : error.response?.data?.error ||
              error.response?.data?.message ||
              JSON.stringify(error.response?.data) ||
              "Unknown error";

        setErrors({ general: msg });
      }
    };

    fetchProfile();
  }, []);

  if (errors.general) {
    return (
      <Alert variant="danger" className="text-center mt-5">
        {errors.general}
      </Alert>
    );
  }

  
  if (!profile) return null;

  const { user, roles } = profile;

  return (
    <div className="container mt-5">
      <div
        className="card shadow p-4 rounded"
        style={{
          maxWidth: "600px",
          margin: "auto",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 className="mt-3">{user.name}</h3>
        <p className="text-muted">{user.email}</p>

        <div className="mt-3">
          <p>
            <strong>Role:</strong> {roles.join(", ")}
          </p>
        </div>

        <Button
          className="mt-3"
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#1E3A5F",
            borderColor: "#1E3A5F",
            color: "#fff",
            borderRadius: "8px",
            padding: "8px 16px",
            transition: "0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#f28c28";
            e.target.style.borderColor = "#f28c28";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#1E3A5F";
            e.target.style.borderColor = "#1E3A5F";
          }}
        >
          ← Go Back
        </Button>
      </div>
    </div>
  );
}
