import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../NotificationPopUp/NotificationPopUp";
import { useSelector } from "react-redux";

const TopBar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 bg-[#FCFCFC] left-56 right-0 flex items-center justify-between px-6 py-4">
      {/* ---- Search Bar ---- */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Scan/Enter Driving License"
          className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* ---- Right Section ---- */}
      <div className="flex items-center space-x-12">
        {/* Message Icon */}
        <div className="relative">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png"
            alt="Notifications"
            className="w-6 h-6 object-contain"
          />
        </div>


        {/* Notification Icon */}
        <div
          className="relative cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
            alt="Notifications"
            className="w-6 h-6 object-contain"
          />
        </div>


        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-none">
              {user?.firstName || user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400">{user?.role || "Admin"}</p>
          </div>
          <img
            src={user?.profileImage || user?.avatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"}
            alt="User Avatar"
            className="w-8 h-8 object-cover rounded-full"
          />
        </div>
      </div>
      <NotificationModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default TopBar;
