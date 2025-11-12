import React from "react";
import { Bell } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const DashboardContent = () => {
    const topCards = [
        {
            title: "Profile Completion",
            value: "Update Info",
            extra: "70%",
            progress: 70,
            color: "bg-blue-600",
        },
        {
            title: "Jobs Applied",
            value: "View All",
            extra: "20",
            color: "bg-blue-600",
        },
        {
            title: "AI Resume Status",
            value: "View Resume",
            extra: "Incomplete",
            color: "bg-red-500",
        },
        {
            title: "Notifications",
            value: "View All",
            icon: <Bell size={14} className="text-blue-500" />,
            color: "bg-blue-600",
        },
    ];

    const projectionData = [
        { month: "Jan", projection: 8000, actual: 12000 },
        { month: "Feb", projection: 10000, actual: 11000 },
        { month: "Mar", projection: 12000, actual: 11000 },
        { month: "Apr", projection: 15000, actual: 18000 },
        { month: "May", projection: 17000, actual: 16000 },
        { month: "Jun", projection: 21000, actual: 22000 },
    ];

    const activityData = [
        { name: "Jan", current: 7680, previous: 5360 },
        { name: "Feb", current: 16575, previous: 10990 },
        { name: "Mar", current: 9000, previous: 9000 },
        { name: "Apr", current: 12546, previous: 9000 },
        { name: "May", current: 15000, previous: 20000 },
        { name: "Jun", current: 22000, previous: 25000 },
    ];

    const summaryData = [
        {
            name: "ASOS Ridley High Waist",
            price: 79.49,
            quantity: 82,
            amount: 6518.18,
        },
        {
            name: "Marco Lightweight Shirt",
            price: 128.5,
            quantity: 37,
            amount: 4754.5,
        },
        { name: "Half Sleeve Shirt", price: 39.99, quantity: 64, amount: 2559.36 },
        { name: "Lightweight Jacket", price: 20.0, quantity: 184, amount: 3680.0 },
        { name: "Marco Shoes", price: 79.49, quantity: 64, amount: 1965.81 },
    ];

    const performanceData = [
        { name: "Direct", value: 300.56 },
        { name: "Affiliate", value: 135.18 },
        { name: "Sponsored", value: 78.02 },
        { name: "E-mail", value: 48.96 },
    ];

    const COLORS = ["url(#blackGradient)", "#7DBBFF", "#71DD8C", "#A0BCE8"];

    return (
        <div className="bg-[#F5F5F5] font-[Inter] ml-56 mt-16 min-h-screen p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                Welcome Back, SuperAdmin
            </h2>

            {/* === TOP SECTION === */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
                {/* Left 2 cols - cards */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {topCards.map((card, index) => {
                        const isBlueCard =
                            card.title === "Profile Completion" ||
                            card.title === "Notifications";

                        return (
                            <div
                                key={index}
                                className={`relative p-4 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden transition 
          ${isBlueCard ? "bg-[#E6F1FD]" : "bg-[#F9F9FA]"}
        `}
                            >
                                {/* Circular progress for Profile Completion */}
                                {card.title === "Profile Completion" && (
                                    <div className="absolute top-3 right-3 w-7 h-7">
                                        <svg className="w-full h-full transform -rotate-90">
                                            {/* Background Circle */}
                                            <circle
                                                cx="14"
                                                cy="14"
                                                r="12"
                                                stroke="#E8DEF8"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            {/* Progress Circle */}
                                            <circle
                                                cx="14"
                                                cy="14"
                                                r="12"
                                                stroke="#3B82F6"
                                                strokeWidth="4"
                                                strokeDasharray={`${(2 * Math.PI * 12 * card.progress) / 100
                                                    }, ${2 * Math.PI * 12}`}
                                                strokeLinecap="round"
                                                fill="none"
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* Card Title */}
                                <div className="flex items-center justify-between">
                                    <p className={"text-black text-sm font-medium "}>
                                        {card.title}
                                    </p>
                                    {card.icon && card.icon}
                                </div>
                                <div className="flex justify-between">
                                    {/* Main Value */}
                                    <h3 className={"text-black font-semibold mt-1 "}>
                                        {card.value}
                                    </h3>

                                    {/* Extra Text */}
                                    {card.extra && (
                                        <p
                                            className={`text-xs mt-2 ${card.title === "AI Resume Status"
                                                ? "text-[#3565E3]"
                                                : isBlueCard
                                                    ? "text-black"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            {card.extra}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right 2 cols - Projection vs Actual */}
                <div className="bg-[#F9F9FA] p-5 rounded-2xl shadow-sm lg:col-span-2">
                    <h4 className="font-semibold text-gray-800 mb-3">
                        Projections vs Actuals
                    </h4>

                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={projectionData} barCategoryGap="40%">
                            {/* Minimal axes */}
                            <XAxis
                                dataKey="month"
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 30000]}
                            />
                            {/* Remove grid, legend */}
                            <Tooltip
                                formatter={(value, name) => [
                                    `${(value / 1000).toFixed(1)}K`,
                                    name,
                                ]}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    padding: "4px 8px",
                                }}
                            />

                            {/* Light (Projection) Bar */}
                            <Bar
                                dataKey="projection"
                                fillOpacity={0.3}
                                fill="#3B82F6"
                                radius={[6, 6, 0, 0]}
                                barSize={30}
                                stackId="stack"
                                name="Projection"
                            />

                            {/* Dark (Actual) Bar */}
                            <Bar
                                dataKey="actual"
                                fill="#3B82F6"
                                radius={[6, 6, 0, 0]}
                                barSize={30}
                                stackId="stack"
                                name="Actual"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* === MIDDLE SECTION === */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                {/* Recent Activity */}
                <div className="bg-[#F9F9FA] p-5 rounded-2xl shadow-sm lg:col-span-3">
                    <div className="flex gap-6">
                        <h4 className="font-semibold text-gray-700 mb-3">
                            Recent Activity
                        </h4>
                        <h4>|</h4>
                        <li className="ml-4 text-sm mt-0.5 font-medium">Current Week </li>
                        <li className="ml-4 text-sm mt-0.5 font-medium">Prevoius Week</li>
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={activityData}>
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                padding={{ left: 20, right: 20 }}
                            />

                            <YAxis
                                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="current"
                                stroke="#000000"
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="previous"
                                stroke="#A0BCE8"
                                strokeDasharray="4 4"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Jobs by Location */}
                <div className="bg-[#F9F9FA] p-5 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-3">Jobs by Location</h4>

                    {/* 🌍 Map Container */}
                    <div className="relative w-full">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                            alt="World Map"
                            className="w-full mb-3 opacity-90 object-contain"
                        />
                        {/* New York */}
                        <ul className="space-y-1.5 text-xs text-gray-700">
                            {/* New York */}
                            <li>
                                <div className="flex justify-between items-center mb-0.5">
                                    <span>New York</span>
                                    <span className="font-semibold">72K</span>
                                </div>
                                <div className="w-full bg-[#A0BCE81A] h-1 rounded-full">
                                    <div
                                        className="bg-[#A0BCE8] h-1 rounded-full transition-all duration-500"
                                        style={{ width: `72%` }}
                                    ></div>
                                </div>
                            </li>

                            {/* San Francisco */}
                            <li>
                                <div className="flex justify-between items-center mb-1">
                                    <span>San Francisco</span>
                                    <span className="font-semibold">39K</span>
                                </div>
                                <div className="w-full bg-[#A0BCE81A] h-1 rounded-full">
                                    <div
                                        className="bg-[#A0BCE8] h-1 rounded-full transition-all duration-500"
                                        style={{ width: `39%` }}
                                    ></div>
                                </div>
                            </li>

                            {/* Sydney */}
                            <li>
                                <div className="flex justify-between items-center mb-1">
                                    <span>Sydney</span>
                                    <span className="font-semibold">25K</span>
                                </div>
                                <div className="w-full bg-[#A0BCE81A] h-1 rounded-full">
                                    <div
                                        className="bg-[#A0BCE8] h-1 rounded-full transition-all duration-500"
                                        style={{ width: `25%` }}
                                    ></div>
                                </div>
                            </li>

                            {/* Singapore */}
                            <li>
                                <div className="flex justify-between items-center mb-1">
                                    <span>Singapore</span>
                                    <span className="font-semibold">61K</span>
                                </div>
                                <div className="w-full bg-[#A0BCE81A] h-1 rounded-full">
                                    <div
                                        className="bg-[#A0BCE8] h-1 rounded-full transition-all duration-500"
                                        style={{ width: `61%` }}
                                    ></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* === BOTTOM SECTION === */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* My Summary */}
                <div className="bg-[#F9F9FA] p-5 rounded-2xl shadow-sm overflow-x-auto lg:col-span-3">
                    <h4 className="font-semibold font-[Poppins] text-black mb-3">
                        My Summary
                    </h4>
                    <table className="w-full text-sm  min-w-[400px]">
                        <thead>
                            <tr className="text-left text-xs text-[#0000004A] border-b">
                                <th className="pb-2">Name</th>
                                <th className="pb-2">Price</th>
                                <th className="pb-2">Quantity</th>
                                <th className="pb-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaryData.map((item, index) => (
                                <tr key={index} className="text-black border-b">
                                    <td className="py-2">{item.name}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Performance Summary */}
                <div className="bg-[#F9F9FA] p-5 rounded-2xl shadow-sm">
                    <h4 className="font-bold text-sm text-black mb-3">
                        Performance Summary
                    </h4>

                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <defs>
                                <linearGradient
                                    id="blackGradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stopColor="#000000" />
                                    <stop offset="100%" stopColor="rgba(28,28,28,0.6)" />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={performanceData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={70}
                                innerRadius={40}
                                paddingAngle={3}
                                startAngle={-270}
                                endAngle={-720}
                            >
                                {performanceData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            {/* ✅ Tooltip on hover */}
                            <Tooltip
                                formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                                contentStyle={{
                                    // color: "white",
                                    backgroundColor: "black",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "18px",
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                }}
                                itemStyle={{ color: "white" }}
                                labelStyle={{ color: "white" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <ul className="text-sm mt-4 space-y-2 text-gray-700">
                        {performanceData.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full bg-black inline-block"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></span>
                                <span className="flex-1">{item.name}</span>
                                <span className="font-semibold">${item.value.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
