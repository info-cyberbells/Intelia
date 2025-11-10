import React, { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Video,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrivers } from "../../features/Drivers/driverSlice";

const Drivers = () => {
  const dispatch = useDispatch();
  const {
    loading,
    data: drivers,
    totalPages,
    currentPage,
    totalDrivers,
    riskScore,
    lowRisk,
    totalLicense,
    error,
  } = useSelector((state) => state.drivers);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchDrivers({ page, limit }));
  }, [dispatch, page]);

  // 🔹 Pagination Controls
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const stats = [
    {
      icon: "🚗",
      label: "Total Drivers",
      value: drivers?.length || 0,
      bgColor: "bg-orange-50",
    },
    { icon: "📄", label: "Risk Scored", value: riskScore, bgColor: "bg-blue-50" },
    { icon: "🎁", label: "Low Risk", value: lowRisk, bgColor: "bg-purple-50" },
    { icon: "👥", label: "Licenses", value: totalLicense, bgColor: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen font-[Poppins] bg-gray-50 p-8 lg:ml-56 mt-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Drivers</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
          Add Driver
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`${stat.bgColor} w-14 h-14 rounded-lg flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loader / Error */}
      {loading && (
        <div className="text-center text-gray-500 text-lg py-10">
          Loading drivers...
        </div>
      )}
      {error && (
        <div className="text-center text-red-500 text-lg py-10">
          Failed to load drivers: {error}
        </div>
      )}

      {/* Drivers Grid */}
      {!loading && !error && drivers?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.driverId}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <img
                    src={
                      driver.profileImage ||
                      "https://via.placeholder.com/150?text=Driver"
                    }
                    alt={driver.driverName || "Driver"}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  {driver.isOnline && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-sm"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {driver.driverName || "Unknown Driver"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">
                        {driver.phoneNumber || "N/A"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {driver.email || "N/A"}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-3">
                <a
                  href={`tel:${driver.phoneNumber || ""}`}
                  className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-lg flex items-center justify-center transition-colors"
                  title={`Call ${driver.driverName}`}
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>

                <a
                  href={`mailto:${driver.email || ""}`}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition-colors"
                  title={`Email ${driver.driverName}`}
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </a>

                {/* 💬 WhatsApp Chat */}
                <a
                  href={`https://wa.me/${(driver.phoneNumber || "").replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition-colors"
                  title={`Chat with ${driver.driverName}`}
                >
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </a>

                {/* 🎥 Video Call (Placeholder) */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Starting video call with ${driver.driverName}`);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition-colors"
                  title={`Video call with ${driver.driverName}`}
                >
                  <Video className="w-5 h-5 text-gray-600" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && !error && totalPages >= 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm text-gray-500">
          <p>
            Page{" "}
            <span className="text-gray-900 font-semibold">{page}</span> of{" "}
            <span className="text-gray-600 font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md ${page === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
                }`}
            >
              ‹
            </button>


            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 rounded-md font-semibold shadow-sm transition-all border ${page === i + 1
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-[#F3CD484A] text-[#F3CD48] border-yellow-200 hover:bg-yellow-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md ${page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
                }`}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
