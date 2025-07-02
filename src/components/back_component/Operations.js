import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Operations() {
  const navigate = useNavigate();
  const serverUrl = "http://127.0.0.1:8000/api/";

  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (!tokenString) return null;
    try {
      return JSON.parse(tokenString);
    } catch {
      return null;
    }
  };

  const getUser = () => {
    try {
      const userString = localStorage.getItem("user");
      return JSON.parse(userString);
    } catch (e) {
      return null;
    }
  };

  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  // save token to session
  const saveToken = (user, token) => {
    setToken(token);
    setUser(user);
    //save roken and user informaiton
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
  };

  const request = axios.create({
    baseURL: serverUrl,
    headers: {
      "Content-Type": "application/json", // JSON بدلاً من multipart unless you have files
    },
  });

  // إضافة interceptor لتضمين التوكن في كل طلب
  request.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // logout user and clear session information
  const logout = async () => {
    try {
      await request.post("logout");
    } catch (err) {
      console.error(err);
    }
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/login");
  };
  return { setToken: saveToken, user, getToken, getUser, request, logout };
}
