import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Briefcase,
  FileText,
  Users,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This week");

  const stats = [
    {
      icon: <Briefcase className="w-6 h-6 text-orange-500" />,
      value: "932",
      label: "Total Drivers",
      bgColor: "bg-orange-50",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      value: "1,032",
      label: "Inquiries",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      value: "102k",
      label: "Incidents",
      bgColor: "bg-blue-50",
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
      value: "32k",
      label: "Licenses",
      bgColor: "bg-yellow-50",
    },
  ];

  const incidentData = [
    { day: "Mon", thisWeek: 45, lastWeek: 50 },
    { day: "Tue", thisWeek: 38, lastWeek: 52 },
    { day: "Wed", thisWeek: 65, lastWeek: 62 },
    { day: "Thu", thisWeek: 55, lastWeek: 70 },
    { day: "Fri", thisWeek: 60, lastWeek: 58 },
    { day: "Sat", thisWeek: 53, lastWeek: 32 },
    { day: "Sun", thisWeek: 70, lastWeek: 18 },
  ];

  const riskData = [
    { label: "Primary", percentage: 27, value: 763, color: "bg-blue-500" },
    { label: "Promotion", percentage: 11, value: 321, color: "bg-indigo-900" },
    { label: "Forum", percentage: 22, value: 69, color: "bg-yellow-400" },
    { label: "Socials", percentage: 15, value: 154, color: "bg-blue-600" },
  ];

  const totalRisk = riskData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:ml-56">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome Back, Debbie Hargreves
        </h1>

        {/* Date Selectors */}
        <div className="flex gap-4 mb-8">
          <button className="bg-white px-6 py-3 rounded-lg shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Change Date</p>
              <p className="text-xs text-gray-500">October, 2025</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <button className="bg-white px-6 py-3 rounded-lg shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">290 C</p>
              <p className="text-xs text-gray-500">Chandigarh</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`${stat.bgColor} w-14 h-14 rounded-lg flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Incidents */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Recent Incidents
            </h2>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
              {selectedPeriod}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-8 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-xs text-gray-500">This Week</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">1,982</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-500">This Week</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">1,345</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-bold text-gray-800">3,982</span>
            <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden ml-2">
              <div
                className="bg-blue-500 h-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              {/* Grid lines */}
              {[0, 20, 40, 60, 80, 100].map((y, i) => (
                <g key={i}>
                  <line
                    x1="40"
                    y1={180 - y * 1.6}
                    x2="580"
                    y2={180 - y * 1.6}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x="10"
                    y={185 - y * 1.6}
                    className="text-xs fill-gray-400"
                  >
                    {y}
                  </text>
                </g>
              ))}

              {/* X-axis labels */}
              {incidentData.map((data, i) => (
                <text
                  key={i}
                  x={80 + i * 80}
                  y="195"
                  className="text-xs fill-gray-600 text-center"
                >
                  {data.day}
                </text>
              ))}

              {/* Yellow line (Last Week) */}
              <polyline
                points={incidentData
                  .map((d, i) => `${80 + i * 80},${180 - d.lastWeek * 1.6}`)
                  .join(" ")}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
              />
              {incidentData.map((d, i) => (
                <circle
                  key={i}
                  cx={80 + i * 80}
                  cy={180 - d.lastWeek * 1.6}
                  r="4"
                  fill="#fbbf24"
                />
              ))}

              {/* Blue line (This Week) */}
              <polyline
                points={incidentData
                  .map((d, i) => `${80 + i * 80},${180 - d.thisWeek * 1.6}`)
                  .join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
              />
              {incidentData.map((d, i) => (
                <circle
                  key={i}
                  cx={80 + i * 80}
                  cy={180 - d.thisWeek * 1.6}
                  r="4"
                  fill="#3b82f6"
                />
              ))}

              {/* Tooltip on Wednesday */}
              <rect
                x="180"
                y="60"
                width="90"
                height="50"
                fill="#1e293b"
                rx="8"
              />
              <text
                x="225"
                y="80"
                className="text-sm fill-white text-center font-medium"
                textAnchor="middle"
              >
                24%
              </text>
              <text
                x="225"
                y="98"
                className="text-xs fill-gray-300 text-center"
                textAnchor="middle"
              >
                982 Visitors
              </text>
            </svg>
          </div>
        </div>

        {/* Risk Assessments */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Risk Assessments
          </h2>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-64 h-64">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 200 200"
              >
                {/* Donut chart segments */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="40"
                  strokeDasharray={`${27 * 5.03} 503`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="40"
                  strokeDasharray={`${11 * 5.03} 503`}
                  strokeDashoffset={`-${27 * 5.03}`}
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="40"
                  strokeDasharray={`${22 * 5.03} 503`}
                  strokeDashoffset={`-${(27 + 11) * 5.03}`}
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="40"
                  strokeDasharray={`${15 * 5.03} 503`}
                  strokeDashoffset={`-${(27 + 11 + 22) * 5.03}`}
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="40"
                  strokeDasharray={`${25 * 5.03} 503`}
                  strokeDashoffset={`-${(27 + 11 + 22 + 15) * 5.03}`}
                />
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-indigo-900 text-white px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-2xl font-bold">11%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Legend</p>
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`}></div>
                  <span className="text-sm text-gray-700">
                    {item.label} ({item.percentage}%)
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post a Job */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-8 border-yellow-400 border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-blue-50 p-4 rounded-full">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute -top-1 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Post a Job
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Get the Assistance */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">7,642</h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Get the Assistance
              </h4>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
              Ask the Bot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
