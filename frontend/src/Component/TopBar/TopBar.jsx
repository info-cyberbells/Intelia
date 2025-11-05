import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {

    const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-56 right-0 bg-white flex items-center justify-between px-6 py-3 shadow-sm">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
        </div>

        {/* Notification Icon */}
        <div className="relative cursor-pointer" onClick={() => navigate("/activity")} >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
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
