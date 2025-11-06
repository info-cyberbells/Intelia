import React from 'react'

const ServerStatus = () => {
  return (
    <div className="bg-white rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-5 sm:p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-[#363B64]">
                Server Status
              </h3>
              <div className="text-gray-400 font-bold text-xl select-none leading-none">
                ...
              </div>
            </div>

            {/* Gradient Progress Bars */}
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

                  {/* Outer bar */}
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden">
                    {/* Inner gradient */}
                    <div
                      className={`h-full rounded-full ${
                        row.c === "blue"
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

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Footer Stats */}
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
          </div>
  )
}

export default ServerStatus