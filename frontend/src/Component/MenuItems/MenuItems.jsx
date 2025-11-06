import React, { useEffect, useState } from "react";
import { Home, Search, Users, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoimage from "../../assets/image.png";

const MenuItems = () => {
  const location = useLocation();

  const role = (localStorage.getItem("role") || "").toLowerCase();

  const ownerMenu = [
    { to: "/dashboard", icon: <Home className="w-5 h-5 mr-3" />, label: "Dashboard" },
    { to: "/search-driver-records", icon: <Search className="w-5 h-5 mr-3" />, label: "Search" },
    { to: "/drivers", icon: <Users className="w-5 h-5 mr-3" />, label: "My Drivers" },
    { to: "/talent-hub", icon: <Briefcase className="w-5 h-5 mr-3" />, label: "Talent Hub" },
  ];

  const userMenu = [
    {
      to: "/dashboard",
      icon: "/menuicons/Dashboard.svg",
      activeIcon: "/menuicons/DashboardFilled.svg",
      label: "Dashboard",
    },
    {
      to: "/profile",
      icon: "/menuicons/Profile.svg",
      activeIcon: "/menuicons/MyProfleFilled.svg",
      label: "My Profile",
    },
    {
      to: "/ai-resumes",
      icon: "/menuicons/ResumeEmpty.svg",
      activeIcon: "/menuicons/ResumeFilled.svg",
      label: "AI Resumes",
    },
    {
      to: "/jobs",
      icon: "/menuicons/jobbag.svg",
      activeIcon: "/menuicons/job.svg",
      label: "Jobs",
    },

    {
      to: "/my-applications",
      icon: "/menuicons/apply.svg",
      activeIcon: "/menuicons/apply.svg",
      label: "My Applications",
    },
    {
      to: "/resources",
      icon: "/menuicons/resourses.svg",
      activeIcon: "/menuicons/resourses.svg",
      label: "Resources",
    },
  ];

  const activeMenu = role === "owner" ? ownerMenu : userMenu;

  return (
    <div className="w-56 font-[Inter] bg-white fixed flex flex-col justify-between h-full left-0 top-0 shadow-lg">
      <div>
        {/* Logo Section */}
        <div className="p-3 pl-12 flex justify-start">
          <img src={logoimage} alt="Logo" className="w-28 h-28 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          {activeMenu.map(({ to, icon, activeIcon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-4 py-2.5 rounded-xl transition-colors ${isActive
                  ? "bg-[#3565E3] text-white"
                  : "text-[#A098AE] hover:bg-gray-100 hover:text-gray-800"
                  }`}
              >
                {typeof icon === "string" ? (
                  <img
                    src={isActive ? activeIcon : icon}
                    alt={label}
                    className="w-5 h-5 fill-white mr-3"
                  />
                ) : (
                  icon
                )}
                {label}
              </Link>
            );
          })}
        </nav>
      </div>


      <div className="px-4 pb-6 flex flex-col justify-end space-y-2">
        {/* Settings */}
        <Link
          to="/settings"
          className="flex items-center cursor-pointer px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <img
            src="/menuicons/Setting.svg"
            alt="Settings"
            className="w-6 h-6 mr-3"
          />
          Settings
        </Link>

        {/* Logout */}
        <button
          className="flex items-center cursor-pointer w-full px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-red-50 transition-colors"
        >
          <img
            src="/menuicons/Task.svg"
            alt="Logout"
            className="w-6 h-6 mr-3"
          />
          Logout
        </button>
      </div>
    </div>

  );
};

export default MenuItems;
