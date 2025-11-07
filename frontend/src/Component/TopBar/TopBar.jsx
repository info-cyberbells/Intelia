import React from "react";
import { useNavigate } from "react-router-dom";
import announcement from '../../assets/announcement.svg';
import message from '../../assets/chat.svg';

const TopBar = () => {

  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-56 bg-[#FCFCFC] right-0 flex items-center justify-between px-6 py-4 border-r">
      {/* ---- Search Bar ---- */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Scan/Enter Driving License"
          className="w-3/4 pl-10 pr-4 py-2 text-sm text-gray-700 bg-[#F5F5F5] font-[Inter] rounded-md  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400"
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
        {/* Menu Icon */}
        <div className="relative">
          <img
            src={message}
            className="w-7 h-7 cursor-pointer"
          />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
        </div>

        {/* Notification Icon */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/activity")}
        >
          <img
            src={announcement}
            alt="Notifications"
            className="w-7 h-7"
          />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
        </div>


        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-none">
              Human
            </p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="User Avatar"
            className="w-8 h-8 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
