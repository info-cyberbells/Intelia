import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  Briefcase,
  FileText,
  Users,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnerDashboard } from "../../features/ownerSlice/ownerSlice";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.owner);
  const [hoveredIncident, setHoveredIncident] = useState(null);
  const [hoveredRisk, setHoveredRisk] = useState(null);

  useEffect(() => {
    dispatch(fetchOwnerDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 lg:ml-56 mt-12 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 lg:ml-56 mt-12 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => dispatch(fetchOwnerDashboard())}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  // Destructure the API data
  const { user, stats, recentIncidents, riskAssessment } = dashboardData;

  const statsCards = [
    {
      icon: <Briefcase className="w-6 h-6 text-orange-500" />,
      value: stats.totalDrivers.toLocaleString(),
      label: "Total Drivers",
      bgColor: "bg-orange-50",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      value: stats.totalInquiries.toLocaleString(),
      label: "Inquiries",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      value: (stats.totalIncidents / 1000).toFixed(0) + "k",
      label: "Incidents",
      bgColor: "bg-blue-50",
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
      value: (stats.upcomingTasks / 1000).toFixed(0) + "k",
      label: "Upcoming Tasks",
      bgColor: "bg-yellow-50",
    },
  ];

  const incidentData = recentIncidents.map(incident => ({
    day: incident.day,
    thisWeek: Math.round(incident.newIssues / 30),
    lastWeek: Math.round(incident.unresolved / 30),
    originalNewIssues: incident.newIssues,
    originalUnresolved: incident.unresolved,
  }));
  const riskData = [
    { label: "Primary", percentage: 27, value: 763, color: "bg-blue-500" },
    { label: "Promotion", percentage: 11, value: 321, color: "bg-indigo-900" },
    { label: "Forum", percentage: 22, value: 69, color: "bg-yellow-400" },
    { label: "Socials", percentage: 15, value: 154, color: "bg-blue-600" },
  ];

  const totalRisk = riskData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:ml-56 mt-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">
          Welcome Back, {user.userName}
        </h1>



        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-2 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`${stat.bgColor} w-14 h-14 rounded-lg flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl md:text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">{stat.label}</p>
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
          </div>

          <div className="flex gap-8 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-xs text-gray-500">New Issues</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {recentIncidents.reduce((sum, item) => sum + item.newIssues, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-500">Unresolved</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {recentIncidents.reduce((sum, item) => sum + item.unresolved, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-bold text-gray-800">
              {(recentIncidents.reduce((sum, item) => sum + item.newIssues + item.unresolved, 0)).toLocaleString()}
            </span>
            <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden ml-2">
              <div
                className="bg-blue-500 h-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="-20 0 620 200">
              <text
                x="-90"
                y="5"
                className="text-xs fill-gray-600 font-medium"
                transform="rotate(-90)"
              >
                Number of Incidents
              </text>
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
                  onMouseEnter={() => setHoveredIncident({
                    day: d.day,
                    newIssues: d.originalNewIssues,
                    unresolved: d.originalUnresolved,
                    x: 80 + i * 80,
                    y: 180 - d.lastWeek * 1.6
                  })}
                  onMouseLeave={() => setHoveredIncident(null)}
                  style={{ cursor: 'pointer' }}
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
                  onMouseEnter={() => setHoveredIncident({
                    day: d.day,
                    newIssues: d.originalNewIssues,
                    unresolved: d.originalUnresolved,
                    x: 80 + i * 80,
                    y: 180 - d.thisWeek * 1.6
                  })}
                  onMouseLeave={() => setHoveredIncident(null)}
                  style={{ cursor: 'pointer' }}
                />
              ))}

              {/* Tooltip on Wednesday */}
              {/* Dynamic Tooltip */}
              {hoveredIncident && (
                <>
                  <rect
                    x={hoveredIncident.x - 50}
                    y={hoveredIncident.y - 70}
                    width="100"
                    height="60"
                    fill="#1e293b"
                    rx="8"
                  />
                  <text
                    x={hoveredIncident.x}
                    y={hoveredIncident.y - 45}
                    className="text-xs fill-white font-medium"
                    textAnchor="middle"
                  >
                    {hoveredIncident.day}
                  </text>
                  <text
                    x={hoveredIncident.x}
                    y={hoveredIncident.y - 28}
                    className="text-xs fill-yellow-400"
                    textAnchor="middle"
                  >
                    New: {hoveredIncident.newIssues}
                  </text>
                  <text
                    x={hoveredIncident.x}
                    y={hoveredIncident.y - 13}
                    className="text-xs fill-blue-400"
                    textAnchor="middle"
                  >
                    Unresolved: {hoveredIncident.unresolved}
                  </text>
                </>
              )}
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
                {riskAssessment.map((item, index) => {
                  const previousTotal = riskAssessment
                    .slice(0, index)
                    .reduce((sum, i) => sum + i.percentage, 0);

                  return (
                    <circle
                      key={index}
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="40"
                      strokeDasharray={`${item.percentage * 5.03} 503`}
                      strokeDashoffset={`-${previousTotal * 5.03}`}
                      onMouseEnter={() => setHoveredRisk(item)}
                      onMouseLeave={() => setHoveredRisk(null)}
                      style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                      opacity={hoveredRisk && hoveredRisk.category !== item.category ? 0.5 : 1}
                    />
                  );
                })}
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-indigo-900 text-white px-4 py-2 rounded-lg shadow-lg">
                  {hoveredRisk ? (
                    <>
                      <p className="text-2xl font-bold">{hoveredRisk.percentage}%</p>
                      <p className="text-xs mt-1">{hoveredRisk.count.toLocaleString()}</p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold">{riskAssessment[0]?.percentage}%</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Legend</p>
            {riskAssessment.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRisk(item)}
                onMouseLeave={() => setHoveredRisk(null)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {item.category}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
