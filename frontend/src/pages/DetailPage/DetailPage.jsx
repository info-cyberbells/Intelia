import React from "react";
import { useLocation } from "react-router-dom";


const Donut = ({ percent = 62, color = "#2F80ED" }) => {

  const deg = Math.min(100, Math.max(0, percent)) * 3.6;
  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 relative grid place-items-center">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(${color} ${deg}deg, #F5F5F5 0deg)`,
        }}
      />
      <div className="absolute w-[60%] h-[60%] bg-white rounded-full shadow-inner grid place-items-center">
        <span className="text-[13px] sm:text-sm font-semibold text-gray-700">
          {percent}%
        </span>
      </div>
    </div>
  );
};


const DetailPage = () => {
  const location = useLocation();
  const driver = location.state?.driver;

  if (!driver) {
    return (
      <div className="ml-56 mt-20 text-red-500 text-xl">
        ❌ Error: No driver data received.
      </div>
    );
  }

  return (
    <div className=" min-h-screen ml-56 mt-12 font-[Poppins] bg-gray-50 p-4 sm:p-6 md:p-8 md:pt-8 font-poppins text-gray-800">
      {/* GRID LAYOUT */}
      <div className="mx-auto w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (spans 2) */}
        <div className="lg:col-span-2 mt-28 space-y-6">
          {/* Profile Card */}
          <div className="relative bg-white rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-6 sm:p-8 overflow-visible">
            {/* Avatar */}
            <div className="absolute -top-10 left-8">
              <img
                src={driver?.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-sm shadow-lg border-4 border-white"
              />
              {/* <div className="w-28 h-28 bg-gray-200 rounded-sm border-4 border-white shadow-md"></div> */}
            </div>

            {/* Top-right ... */}
            <div className="absolute top-2 right-6 text-gray-400 font-bold text-xl select-none">
              ...
            </div>

            {/* Edit button */}
            <button className="absolute top-4 right-24 bg-yellow-50 text-yellow-700 font-medium text-sm px-4 py-2 rounded-sm shadow-sm hover:bg-yellow-100 transition">
              Edit Profile
            </button>

            {/* Content Row */}
            <div className=" flex flex-col sm:flex-row sm:justify-between sm:items-start">
              {/* Left: Details (aligned to avatar) */}
              <div className="pl-[8rem]">
                <h2 className="text-2xl -mt-4 font-semibold text-gray-800">
                  {driver?.fullName}
                </h2>

                <p className="text-sm font-medium text-gray-500 mt-1">
                  License:{" "}
                  <span className="font-semibold text-gray-700">
                    {driver?.licenseNumber}
                  </span>

                </p>
                <p className="text-sm text-gray-400 mt-0.5">30/100</p>

                {/* Contact Info */}
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-x-8 gap-y-4">
                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-yellow-100 grid place-items-center text-yellow-500">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.6 10.8a15.3 15.3 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.37 2.3.57 3.6.57a1 1 0 011 1v3.5a1 1 0 01-1 1C12.6 20 4 11.4 4 1.9A1 1 0 015 1h3.5a1 1 0 011 1c0 1.3.2 2.5.57 3.6a1 1 0 01-.25 1L6.6 10.8z" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">
                      {driver?.phoneNumber}
                    </span>

                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-yellow-100 grid place-items-center text-yellow-500">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">
                      {driver?.email}
                    </span>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                Risk Assessment
              </h3>
              <div className="text-gray-400 font-bold text-xl select-none">
                ...
              </div>
            </div>

          
            <div className="mt-5 flex gap-2">
              <button className="px-4 py-2 rounded-sm bg-yellow-400/30 text-yellow-700 font-semibold">
                Chart
              </button>
              <button className="px-4 py-2 rounded-sm bg-gray-100 text-gray-600 font-medium">
                Activity
              </button>
            </div>

           
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <Donut percent={81} color="#F2C94C" />
                <p className="mt-3 text-sm font-semibold text-gray-800">
                  Total Incidents
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Donut percent={22} color="#F2C94C" />
                <p className="mt-3 text-sm font-semibold text-gray-800">Miles Driven</p>
              </div>
              <div className="flex flex-col items-center">
                <Donut percent={62} color="#F2C94C" />
                <p className="mt-3 text-sm font-semibold text-gray-800">Safety Score</p>
              </div>
              <div className="flex flex-col items-center sm:col-span-2 lg:col-span-1">
                <Donut percent={62} color="#2F80ED" />
                <p className="mt-3 text-sm font-semibold text-gray-800">
                  Income Increase
                </p>
              </div>
            </div>

           
            <div className="my-8 border-t border-dashed border-gray-300"></div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <h4 className="font-semibold text-slate-800">Report Driver</h4>
                <p className="text-gray-500 text-sm mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                </p>
              </div>
              <button className="justify-self-start sm:justify-self-end px-5 py-3 rounded-sm bg-yellow-400/30 text-yellow-700 font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* <div className="bg-white rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-5 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-[#363B64]">
                Server Status
              </h3>
              <div className="text-gray-400 font-bold text-xl select-none leading-none">
                ...
              </div>
            </div>
            <div className="space-y-5">
              {[
                { t: "10 AM", v: 75, c: "yellow" },
                { t: "8 AM", v: 55, c: "mint" },
                { t: "6 AM", v: 70, c: "blue" },
                { t: "4 AM", v: 45, c: "yellow" },
                { t: "2 AM", v: 30, c: "yellow" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-10 text-xs text-[#A098AE] text-right shrink-0">
                    {row.t}
                  </span>

           
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden">
               
                    <div
                      className={`h-full rounded-full ${row.c === "blue"
                        ? "bg-gradient-to-r from-blue-600 via-blue-400 to-blue-50"
                        : row.c === "mint"
                          ? "bg-gradient-to-r from-teal-600 via-teal-400 to-teal-50"
                          : "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-50"
                        }`}
                      style={{ width: `${row.v}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-gray-200"></div>

       
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-400 leading-tight">Country</p>
                <p className="font-semibold text-gray-800">India</p>
              </div>
              <div>
                <p className="text-gray-400 leading-tight">Domain</p>
                <p className="font-semibold text-gray-800">website.com</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 leading-tight">▲</p>
                <p className="font-semibold text-gray-800">2.0 mbps</p>
              </div>
            </div>
          </div> */}


          {/* Recent Drivers */}
          {/* <div className="bg-white rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-5 sm:p-6 mt-6">
    
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#363B64]">
                  Recent Drivers
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  You have 456 Drivers
                </p>
              </div>
              <button className="w-9 h-9 rounded-md bg-blue-600 grid place-items-center text-white text-xl font-light shadow-sm hover:bg-blue-700 transition">
                +
              </button>
            </div>

    
            <div className="space-y-2.5">
              {[
                { name: "Samantha William", role: "Marketing Manager" },
                { name: "Tony Soap", role: "UI Designer" },
                { name: "Karen Hope", role: "Web Developer" },
                { name: "Jordan Nico", role: "Graphic Design" },
                { name: "Nadila Adja", role: "QA Engineer" },
              ].map((u, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-md p-2.5 transition`}
                >
        
                  <div className="w-10 h-10 rounded-md bg-gray-200 flex-shrink-0"></div>

               
                  <div className="flex-1">
                    <p className="font-medium text-[13px] text-gray-800 leading-tight">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{u.role}</p>
                  </div>

             
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md grid place-items-center hover:bg-gray-100 transition">
                      <img
                        src="/message.png"
                        alt="Mail Icon"
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>


            <button className="mt-5 w-full py-2.5 rounded-md bg-[#6E6CDF1A] text-blue-700 text-sm font-semibold hover:bg-blue-100 transition">
              View More
            </button>
          </div> */}


        </div>
      </div>
    </div>
  );
};

export default DetailPage;
