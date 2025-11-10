import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NotificationModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  const navigate = useNavigate();

  // ✅ Always call hooks before any conditional return
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

  const notifications = [
    {
      id: 1,
      name: "Kristin Watson",
      Last: "alexander",
      action: "Rate ⭐ 5 for 3D soothing wallpaper. This is best wallpaper. ",
      date: "Jun 23",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      name: "Leslie Alexander",
      Last: "flores",
      action: "Likes 3D computer improved version",
      date: "Aug 15",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 3,
      name: "Annette Black",
      Last:"edwards",
      action: "Comment on Gray vintage 3D computer",
      date: "Apr 11",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 4,
      name: "Brooklyn Simmons",
      Last: "cooper",
      action: "Purchased 3D dark mode wallpaper",
      date: "Nov 10",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 5,
      name: "Brooklyn Simmons",
      Last: "alexandra",
      action: "Purchased 3D dark mode wallpaper",
      date: "Nov 10",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 font-[Inter] flex items-start justify-end bg-transparent">
      {/* Click area + container */}
      <div
        ref={modalRef}
        className="relative mt-14 mr-32 w-[340px] bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 animate-slide-down"
      >
        {/*Small arrow pointing up */}
        <div className="absolute -top-2 right-10 w-4 h-4 bg-white rotate-45 border-t border-gray-200"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold text-[#303030]">
            Notification
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Notification list */}
        <div className="space-y-3 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 border-b border-[#D4D4D4] pb-3 mb-3"
            >
              {/* Avatar */}
              <img
                src={n.avatar}
                alt={n.name}
                className="w-10 h-10 rounded-full"
              />

              {/* Notification Content */}
              <div className="flex-1">
                {/* Header Row: Name + Date */}
                <div className="flex justify-between items-start">
                  <p className="font-medium text-[#303030] tracking-tight text-sm">
                    {n.name}{" "}
                    <span className="text-xs text-[#B5B5B5] ml-1">enjfeof</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">{n.date}</p>
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                </div>

                {/* Action Text */}
                <p className="text-[#303030] tracking-tight text-[13px] mt-1 truncate w-[240px]">{n.action}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer button */}
        <button
          onClick={() => {
            navigate("/notifications");
            onClose();
          }}
          className="w-full mt-6 bg-[#3565E3] text-white text-xs font-medium py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          See all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
