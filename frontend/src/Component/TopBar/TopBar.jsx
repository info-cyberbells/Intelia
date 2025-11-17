import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../NotificationPopUp/NotificationPopUp";
import OwnerNotificationModal from "../NotificationPopUp/OwnerNotificationModal";
import { useSelector, useDispatch } from "react-redux";
import { searchDriverByLicense } from "../../features/ownerSlice/ownerSlice";
import { searchDriverByLicenseSuperadmin } from "../../features/SuperAdminSlice/SuperAdminSlice";
import { SearchAllJobs } from "../../features/Jobs/JobsSlice";
import { useToast } from "../../context/ToastContext";
import { createPortal } from "react-dom";


const TopBar = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [license, setLicense] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch suggestions as user types
  useEffect(() => {
    if (user?.role?.toLowerCase() === "driver" && license.trim().length > 2) {
      const delayDebounce = setTimeout(async () => {
        const res = await dispatch(SearchAllJobs({ keyword: license }));
        if (res.meta.requestStatus === "fulfilled") {
          setSuggestions(res.payload.jobs || []);
          setShowSuggestions(true);
        }
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [license, user, dispatch]);

  const handleSuggestionClick = (job) => {
    setLicense("");
    setSuggestions([]);
    setShowSuggestions(false);

    navigate("/search-job-details", {
      state: { job }
    });
  };


  const handleSearch = async () => {
    if (!license.trim()) {
      showToast("Please enter a license number", "error");
      return;
    }
    console.log("suer", user?.role);

    let apiToUse;

    if (user?.role?.toLowerCase() === "superadmin") {
      apiToUse = searchDriverByLicenseSuperadmin;
    }
    else if (user?.role?.toLowerCase() === "owner") {
      apiToUse = searchDriverByLicense;
    }
    else if (user?.role?.toLowerCase() === "driver") {
      apiToUse = SearchAllJobs;
    }

    const res = await dispatch(
      user?.role?.toLowerCase() === "driver"
        ? apiToUse({ keyword: license })
        : apiToUse(license)
    );


    if (res.meta.requestStatus === "fulfilled") {

      if (user?.role?.toLowerCase() === "driver") {
        showToast("Job found!", "success");
        navigate("/search-job-details", {
          state: { job: res.payload.jobs[0] }
        });
      } else {
        showToast("Driver found!", "success");
        navigate("/detail-page", {
          state: { driver: res.payload.drivers[0] }
        });
      }


      setLicense("");
    } else {
      showToast(res.payload || "No driver found", "error");
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 bg-[#FCFCFC] left-56 right-0 flex items-center justify-between px-6 py-4">
      {/* ---- Search Bar ---- */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder={
            user?.role?.toLowerCase() === "driver"
              ? "Search for job with title"
              : "Scan/Enter Driving License"
          }
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="w-full pl-5 pr-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400"
        />
        {user?.role?.toLowerCase() !== "driver" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 cursor-pointer"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}


        {/* ✅ Suggestions Dropdown */}
        {showSuggestions && createPortal(
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-[9999]"
            style={{
              top: document.querySelector('input[type="text"]')?.getBoundingClientRect().bottom + 4 + 'px',
              left: document.querySelector('input[type="text"]')?.getBoundingClientRect().left + 'px',
              width: document.querySelector('input[type="text"]')?.getBoundingClientRect().width + 'px'
            }}
            onMouseDown={(e) => e.stopPropagation()}

          >
            {suggestions.length > 0 ? (
              suggestions.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleSuggestionClick(job)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {job.ownerId?.companyName} • {job.location?.city}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {job.description}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <span className="text-sm font-semibold text-green-600">
                        ₹{job.salary?.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`block text-xs mt-1 px-2 py-0.5 rounded-full ${job.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No results found</p>
              </div>
            )}
          </div>,
          document.body
        )}
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
          className={`relative ${user?.role?.toLowerCase() === "superadmin" ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => setOpen(true)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
            alt="Notifications"
            className="w-6 h-6 object-contain"
          />
        </div>


        {/* User Profile */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.role || "Admin"}
            </p>
          </div>

          {/* Avatar */}
          <img
            src={user?.profileImage || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"}
            alt="User Avatar"
            className="w-10 h-10 object-cover rounded-full border-2 border-gray-200 shadow-sm"
          />
        </div>
      </div>
      {user?.role === "owner" && (
        <OwnerNotificationModal isOpen={open} onClose={() => setOpen(false)} />
      )}

      {/* Driver Notification (KEEP YOUR ORIGINAL) */}
      {user?.role === "driver" && (
        <NotificationModal isOpen={open} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default TopBar;
