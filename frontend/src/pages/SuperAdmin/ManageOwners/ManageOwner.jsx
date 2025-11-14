import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminOwners } from "../../../features/ownerSlice/ownerSlice";
import { deleteOwner, resetDeleteState } from "../../../features//SuperAdminSlice/SuperAdminSlice";
import { useToast } from '../../../context/ToastContext';


const ManageOwnersTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const {
        loading,
        data: owners,
        totalPages,
        currentPage,
        error,
    } = useSelector((state) => state.owner);

    const [page, setPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const status = showActiveOnly ? "active" : "";
        dispatch(fetchSuperAdminOwners({ search: debouncedSearch, status, page, limit }));
    }, [dispatch, debouncedSearch, showActiveOnly, page]);

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
        if (selectedRows.length === owners?.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(owners?.map((owner) => owner._id) || []);
        }
    };

    const handleDelete = async (ids) => {
        const deleteIds = Array.isArray(ids) ? ids : [ids];

        if (deleteIds.length === 0) {
            showToast("Please select at least one owner to delete");
            return;
        }

        if (!window.confirm("Are you sure you want to delete?")) return;

        for (const id of deleteIds) {
            const res = await dispatch(deleteOwner(id));

            if (res.meta.requestStatus === "fulfilled") {
                showToast("Owner deleted successfully!", "success");
            } else {
                showToast("Failed to delete owner", "error");
            }
        }

        dispatch(resetDeleteState());

        // Refresh list
        dispatch(fetchSuperAdminOwners({ search, status: showActiveOnly ? "active" : "", page, limit }));
    };


    const handleExport = () => {
        if (selectedRows.length === 0) {
            showToast("Please select at least one owner to export");
            return;
        }

        // Filter selected owners
        const selectedOwners = owners.filter(owner => selectedRows.includes(owner._id));

        // Prepare CSV headers
        const headers = [
            "Sr.No",
            "Owner Name",
            "Email",
            "Phone Number",
            "Registered On",
            "Status"
        ];

        // Prepare CSV rows
        const csvRows = selectedOwners.map((owner, index) => {
            return [
                index + 1,
                owner.fullName || "N/A",
                owner.email || "N/A",
                owner.phoneNumber || "N/A",
                new Date(owner.createdAt).toLocaleDateString(),
                owner.isActive ? "Active" : "Inactive"
            ];
        });

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...csvRows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `owners_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Owners exported successfully!");
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

    const getStatusBadge = (isActive) => {
        if (isActive) {
            return (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Active
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                Inactive
            </span>
        );
    };

    return (
        <div className="min-h-screen font-[Poppins] bg-gray-50 p-8 lg:ml-56 mt-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Owner Management</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search owners..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 w-full md:w-56"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleDelete(selectedRows)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export
                    </button>

                    <button
                        onClick={() => navigate("/add-owner")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Owner
                    </button>
                </div>
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="text-center text-gray-500 text-lg py-10">Loading owners...</div>
            )}
            {error && (
                <div className="text-center text-red-500 text-lg py-10">
                    Failed to load owners: {error}
                </div>
            )}

            {/* Table */}
            {!loading && !error && owners?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-12 px-3 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === owners?.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="w-16 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Sr.No
                                </th>
                                <th className="w-48 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Owner Name
                                </th>
                                <th className="w-24 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Company Name
                                </th>
                                <th className="w-56 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Email
                                </th>
                                <th className="w-36 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Phone
                                </th>
                                <th className="w-40 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Registered On
                                </th>
                                <th className="w-28 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="w-48 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {owners.map((owner, index) => (
                                <tr
                                    key={owner._id}
                                    className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(owner._id) ? "bg-blue-50" : ""
                                        }`}
                                >
                                    <td className="px-3 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(owner._id)}
                                            onChange={() => toggleRowSelection(owner._id)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-600">
                                        {(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    owner.profileImage ||
                                                    "https://ui-avatars.com/api/?name=" + (owner.fullName || "Owner") + "&background=3B82F6&color=fff&size=40"

                                                }
                                                alt={owner.fullName}
                                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                            />
                                            <span className="text-sm font-medium text-gray-800 truncate">
                                                {owner.fullName || "Unknown"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-600">
                                        <div className="truncate">
                                            {owner.companyName || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-600">
                                        <div className="truncate" title={owner.email}>
                                            {owner.email || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-600">
                                        {owner.phoneNumber || "N/A"}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                                            <span className="truncate">{formatDate(owner.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">{getStatusBadge(owner.isActive)}</td>

                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => navigate(`/edit-owner/${owner._id}`)}
                                                className="text-gray-600 hover:text-gray-700 text-sm font-medium whitespace-nowrap">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(owner._id)}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium whitespace-nowrap">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && owners?.length === 0 && (
                <div className="text-center text-gray-500 text-lg py-10">
                    No owners found matching your search.
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

export default ManageOwnersTable;