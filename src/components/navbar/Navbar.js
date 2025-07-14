import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaConciergeBell,
  FaSignInAlt,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import "./Navbar.css";
import logo from "../../assets/img/logo.jpg";
import Operations from "../back_component/Operations";
import { useQuery } from "@tanstack/react-query";
import { onMessageListener } from "../../firebase";

const Navbar = () => {
  const { logout, getUser, request } = Operations();
  // حالة فتح القائمة المنسدلة
  const [notifOpen, setNotifOpen] = useState(false);

  // جلب عدد الإشعارات غير المقروءة
  const {
    data: unreadCount = 0,
    isLoading: notifLoading,
    refetch: refetchUnread,
  } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: async () => {
      const res = await request.get("getUnreadCount");
      // دعم عدة احتمالات للهيكل
      if (typeof res.data === "object" && res.data !== null) {
        if (typeof res.data.unread === "number") return res.data.unread;
        if (typeof res.data.count === "number") return res.data.count;
        if (typeof res.data.unreadCount === "number")
          return res.data.unreadCount;
      }
      if (typeof res.data === "number") return res.data;
      return 0;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 30 * 1000,
    enabled: !!getUser(),
  });

  // جلب الإشعارات
  const {
    data: notifications = [],
    isLoading: notifListLoading,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notificationsList"],
    queryFn: async () => {
      const res = await request.get("getNotifications");
      // توقع أن يكون res.data.notifications أو res.data.data أو فقط res.data
      return res.data.notifications ?? res.data.data ?? res.data ?? [];
    },
    enabled: notifOpen && !!getUser(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 30 * 1000,
  });

  // عند وصول إشعار من فايربيز: أعد جلب الإشعارات وعدد الغير مقروء دائماً
  React.useEffect(() => {
    const unsubscribe = onMessageListener().then(() => {
      refetchUnread();
      refetchNotifications();
    });
    // eslint-disable-next-line
  }, []);

  const menuItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/about", icon: <FaInfoCircle />, label: "About" },
    { path: "/services", icon: <FaConciergeBell />, label: "Services" },
    { path: "/contact", icon: <FaPhone />, label: "Contact" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container-fluid">
          <div className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo" />
            <h2 className="ms-2 logo-text">LMC</h2>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {/* زر الإشعارات */}
              {getUser() && (
                <li className="nav-item me-2 position-relative">
                  <button
                    className="btn btn-link nav-link p-0 position-relative"
                    style={{ fontSize: 22 }}
                    onClick={() => setNotifOpen((v) => !v)}
                    aria-label="Notifications"
                  >
                    <FaBell />
                    {/* البادج */}
                    {unreadCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: 10 }}
                      >
                        {notifLoading ? "..." : unreadCount}
                      </span>
                    )}
                  </button>
                  {/* القائمة المنسدلة للإشعارات */}
                  {notifOpen && (
                    <div
                      className="shadow position-absolute mt-2 end-0"
                      style={{
                        minWidth: 320,
                        maxWidth: 400,
                        maxHeight: "60vh",
                        overflowY: "auto",
                        zIndex: 2000,
                        right: 0,
                        background: "#fff",
                        border: "2px solid #FF7F00",
                        boxShadow: "0 4px 24px rgba(30,58,95,0.10)",
                        borderRadius: 16,
                        fontFamily: "Cairo, sans-serif",
                      }}
                    >
                      <div
                        className="p-2 border-bottom fw-bold text-center"
                        style={{
                          background: "#1E3A5F",
                          color: "#fff",
                          borderTopLeftRadius: 14,
                          borderTopRightRadius: 14,
                          fontSize: 18,
                          border: 0,
                        }}
                      >
                        Notifications
                      </div>
                      {notifListLoading ? (
                        <div className="p-3 text-center text-muted">
                          Loading...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-3 text-center text-muted">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notif, idx) => {
                          const isUnread =
                            notif.read === false ||
                            notif.is_read === false ||
                            notif.is_read === 0 ||
                            notif.read === 0;
                          return (
                            <div
                              key={notif.id || idx}
                              className="p-3 border-bottom small position-relative notif-item"
                              style={{
                                background: idx % 2 === 0 ? "#f7f7f7" : "#fff",
                                border: 0,
                                cursor: isUnread ? "pointer" : "default",
                                opacity: isUnread ? 1 : 0.7,
                              }}
                              onClick={async () => {
                                if (!isUnread || !notif.id) return;
                                try {
                                  await request.post(`markAsRead/${notif.id}`);
                                  refetchUnread();
                                  refetchNotifications();
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                            >
                              {/* شارة غير مقروء */}
                              {isUnread && (
                                <span
                                  className="position-absolute top-0 end-0 translate-middle badge rounded-circle bg-danger"
                                  style={{
                                    width: 12,
                                    height: 12,
                                    right: 8,
                                    top: 8,
                                    padding: 0,
                                    border: "2px solid #fff",
                                  }}
                                ></span>
                              )}
                              <div
                                className="fw-bold"
                                style={{ color: "#1E3A5F" }}
                              >
                                {notif.title || notif.Title || "Notification"}
                              </div>
                              <div
                                className="text-muted"
                                style={{ color: "#333" }}
                              >
                                {notif.body ||
                                  notif.content ||
                                  notif.Content ||
                                  "---"}
                              </div>
                              <div
                                className="text-end text-secondary"
                                style={{ fontSize: 10, color: "#FF7F00" }}
                              >
                                {notif.created_at
                                  ? new Date(notif.created_at).toLocaleString(
                                      "en-US"
                                    )
                                  : ""}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </li>
              )}
              {/* عناصر القائمة الأخرى */}
              {getUser() ? (
                <li className="nav-item">
                  <Link
                    onClick={logout}
                    className="nav-link d-flex align-items-center"
                  >
                    <FaSignOutAlt /> <span className="ms-1">Logout</span>
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link
                    to={"/login"}
                    className="nav-link d-flex align-items-center"
                  >
                    <FaSignInAlt /> <span className="ms-1">Login</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="navbar-placeholder"></div>
    </>
  );
};

export default Navbar;
