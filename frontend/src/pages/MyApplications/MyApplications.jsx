import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyJobsApplications } from "../../features/Drivers/driverSlice";
import { MoreVertical } from "lucide-react";


const ManageJobsTable = () => {

    const dispatch = useDispatch();
    const { applications, loading, error } = useSelector((state) => state.drivers);
    const [jobs, setJobs] = useState([]);

    const [page, setPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        dispatch(fetchMyJobsApplications());
    }, [dispatch]);

    useEffect(() => {
        if (applications?.length) {
            setJobs(applications);
        }
    }, [applications]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);


    const totalPages = Math.ceil(jobs.length / limit);
    const paginatedJobs = jobs.slice((page - 1) * limit, page * limit);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    };

    const toggleRowSelection = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === paginatedJobs?.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(paginatedJobs?.map((job) => job._id) || []);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-600", label: "Pending" },
            "in-progress": { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-600", label: "In Progress" },
            completed: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-600", label: "Completed" },
            cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-600", label: "Cancelled" }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-medium`}>
                <span className={`w-1.5 h-1.5 ${config.dot} rounded-full`}></span>
                {config.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen font-[Poppins] bg-gray-50 p-8 lg:ml-56 mt-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Jobs Application</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* <input
                        type="text"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 w-full md:w-64"
                    /> */}
                    {/* <button
                        onClick={() => {
                            setShowActiveOnly((prev) => !prev);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${showActiveOnly
                            ? "bg-blue-100 text-blue-700 border-blue-400"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {showActiveOnly ? "Active Only" : "Show Active"}
                    </button> */}
                </div>
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="text-center text-gray-500 text-lg py-10">Loading Jobs...</div>
            )}
            {error && (
                <div className="text-center text-red-500 text-lg py-10">
                    Failed to load Jobs: {error}
                </div>
            )}

            {/* Table */}
            {!loading && !error && paginatedJobs?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {/* <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === paginatedJobs?.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th> */}
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Sr.No
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Job Title
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Company Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Location
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Applid On
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedJobs.map((job, index) => (
                                <tr
                                    key={job._id}
                                    className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(job._id) ? "bg-blue-50" : ""
                                        }`}
                                >
                                    {/* <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(job._id)}
                                            onChange={() => toggleRowSelection(job._id)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td> */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-800">
                                                {job.jobTitle || "Unknown"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {job.companyName || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {job.location || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {formatDate(job.appliedOn)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && paginatedJobs?.length === 0 && (
                <div className="text-center text-gray-500 text-lg py-10">
                    No jobs found
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages >= 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm text-gray-500">
                    <p>
                        Page <span className="text-gray-900 font-semibold">{page}</span> of{" "}
                        <span className="text-gray-600 font-semibold">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                                }`}
                        >
                            ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-8 h-8 rounded-md font-semibold transition-all ${page === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

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

export default ManageJobsTable;