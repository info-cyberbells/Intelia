import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDriverNotifications } from "../../features/notifications/notificationSlice";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

// 🔹 Inline fade-in animation 
const fadeInStyle = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-in-out;
}
`;


const NotificationModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isOpen) dispatch(fetchDriverNotifications());
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;


  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        // 🎯 Clipboard / file icon (for job application updates)
        return "https://cdn-icons-png.flaticon.com/512/942/942799.png";

      case "profile":
        // 👤 Verified profile or account update
        return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

      case "alert":
        // ⚠️ Clean modern alert bell
        return "https://cdn-icons-png.flaticon.com/512/3602/3602145.png";

      case "message":
        // 💬 Message or communication icon
        return "https://cdn-icons-png.flaticon.com/512/2462/2462719.png";

      default:
        // 📢 Default notification
        return "https://cdn-icons-png.flaticon.com/512/3602/3602145.png";
    }
  };


  const latestNotifications = notifications.slice(0, 5);

  return createPortal(
    <div className="fixed inset-0 z-[9999] font-[Inter] flex items-start justify-end bg-transparent">
      <style>{fadeInStyle}</style>
      <div
        ref={modalRef}
        className="relative mt-16 mr-40 w-[340px] bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 animate-fadeIn"
      >
        <div className="absolute -top-2 right-10 w-4 h-4 bg-white rotate-45 border-t border-gray-200"></div>

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold text-[#303030]">Notification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-4 text-sm">Loading...</p>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-80">
            {latestNotifications.length > 0 ? (
              latestNotifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 border-b border-gray-200 pb-3 ${!n.isRead ? "bg-blue-50 rounded-lg p-2" : ""
                    }`}
                >
                  <img
                    src={getNotificationIcon(n.type)}
                    alt={n.title}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-50 p-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-[#303030] text-sm">{n.title}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-6">
                You’re all caught up — no new notifications!
              </p>
            )}

          </div>
        )}

        <button
          onClick={() => {
            navigate("/notifications");
            onClose();
          }}
          className="w-full mt-4 bg-[#3565E3] text-white text-xs font-medium py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          See all notifications
        </button>
      </div>
    </div>,
    document.body
  );
};

export default NotificationModal;
