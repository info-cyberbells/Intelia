import React, { useEffect, useState } from "react";
import { Home, Search, Users, Briefcase } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/userSlice/userSlice";
import logoimage from "../../assets/image.png";

const MenuItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = (user?.role || "").toLowerCase();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const ownerMenu = [
    { to: "/admin-dashboard", icon: <Home className="w-5 h-5 mr-3" />, label: "Dashboard" },
    { to: "/search-driver-records", icon: <Search className="w-5 h-5 mr-3" />, label: "Search" },
    { to: "/drivers", icon: <Users className="w-5 h-5 mr-3" />, label: "My Drivers" },
    { to: "/talent-hub", icon: <Briefcase className="w-5 h-5 mr-3" />, label: "Talent Hub" },
  ];

  const superAdminMenu = [
    { to: "/dashboard", icon: <Home className="w-5 h-5 mr-3" />, label: "Dashboard" },
    { to: "/manage-owners", icon: <Users className="w-5 h-5 mr-3" />, label: "Manage Owners" },
    { to: "/manage-drivers", icon: <Users className="w-5 h-5 mr-3" />, label: "Manage Drivers" },
    { to: "/manage-jobs", icon: <Users className="w-5 h-5 mr-3" />, label: "Manage Jobs" },
    // { to: "/reports", icon: <Briefcase className="w-5 h-5 mr-3" />, label: "Reports" },
  ];

  const userMenu = [
    {
      to: "/driver-dashboard",
      icon: "/menuicons/Dashboard.svg",
      activeIcon: "/menuicons/Dashboard_active.svg",
      label: "Dashboard",
    },
    {
      to: "/my-profile",
      icon: "/menuicons/Profile.svg",
      activeIcon: "/menuicons/Profile_activeicon.svg",
      label: "My Profile",
    },
    {
      to: "/ai-resumes",
      icon: "/menuicons/ResumeEmpty.svg",
      activeIcon: "/menuicons/ai_resumeactive.svg",
      label: "AI Resume",
    },
    {
      to: "/driver-jobs",
      icon: "/menuicons/jobbag.svg",
      activeIcon: "/menuicons/jobs_active.svg",
      label: "Jobs",
    },

    {
      to: "/my-applications",
      icon: "/menuicons/apply.svg",
      activeIcon: "/menuicons/my_applicationactive.svg",
      label: "My Applications",
    },
    {
      to: "/resources",
      icon: "/menuicons/resourses.svg",
      activeIcon: "/menuicons/resonance-active.svg",
      label: "Resources",
    },

    {
      to: "/my-resume",
      icon: "/menuicons/review _active.svg",
      activeIcon: "/menuicons/Review_menu.svg",
      label: "My Resume",
    },
  ];

  let activeMenu;

  if (role === "owner") {
    activeMenu = ownerMenu;
  } else if (role === "superadmin") {
    activeMenu = superAdminMenu;
  } else {
    activeMenu = userMenu;
  }


  return (
    <div className="w-56 font-[Inter] bg-[#FCFCFC] fixed flex flex-col justify-between h-full left-0 top-0 border-r border-gray-200">
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
        {role !== "superadmin" && (
          <Link
            to="/settings"
            className={`flex items-center cursor-pointer px-4 py-3 rounded-xl transition-colors ${location.pathname === "/settings"
              ? "bg-[#3565E3] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
          >
            <img
              src={
                location.pathname === "/settings"
                  ? "/menuicons/settings_active.svg"
                  : "/menuicons/Setting.svg"
              }
              alt="Settings"
              className="w-6 h-6 mr-3"
            />
            Settings
          </Link>
        )}



        {/* Logout */}
        <button
          onClick={handleLogout}
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
