import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const VerificationRequestsModal = ({ isOpen, onClose, drivers, onApprove, onReject, onViewDriver }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

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

    const toggleRowSelection = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === drivers?.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(drivers?.map((driver) => driver._id) || []);
        }
    };

    const handleBulkApprove = () => {
        if (selectedRows.length === 0) return;
        selectedRows.forEach(id => onApprove(id));
        setSelectedRows([]);
    };

    const handleBulkReject = () => {
        if (selectedRows.length === 0) return;
        if (!window.confirm(`Are you sure you want to reject ${selectedRows.length} driver(s)?`)) return;
        selectedRows.forEach(id => onReject(id));
        setSelectedRows([]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Driver Account Verification List
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {drivers?.length || 0} pending request{drivers?.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Action Buttons */}
                {drivers && drivers.length > 0 && (
                    <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
                        <div className="text-sm text-gray-600">
                            {selectedRows.length > 0 && (
                                <span className="font-medium">
                                    {selectedRows.length} driver{selectedRows.length !== 1 ? 's' : ''} selected
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Table Content */}
                <div className="overflow-y-auto flex-1 px-8 py-4">
                    {drivers && drivers.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="w-16 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Sr.No
                                        </th>
                                        <th className="w-48 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Driver Name
                                        </th>
                                        <th className="w-56 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Email
                                        </th>
                                        <th className="w-36 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Phone Number
                                        </th>

                                        <th className="w-40 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Requested On
                                        </th>
                                        <th className="w-28 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="w-24 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Reviews
                                        </th>
                                        <th className="w-48 px-3 py-4 text-left text-sm font-semibold text-gray-700">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {drivers.map((driver, index) => (
                                        <tr
                                            key={driver._id}
                                            className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(driver._id) ? "bg-blue-50" : ""
                                                }`}
                                        >

                                            <td className="px-3 py-4 text-sm text-gray-600">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            driver.profileImage ||
                                                            "https://via.placeholder.com/40?text=D"
                                                        }
                                                        alt={driver.fullName}
                                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800 truncate">
                                                        {driver.fullName || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600">
                                                <div className="truncate" title={driver.email}>
                                                    {driver.email || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600">
                                                {driver.phoneNumber || "N/A"}
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
                                                    <span className="truncate">{formatDate(driver.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                                    Inactive
                                                </span>
                                            </td>
                                            <td className="px-3 py-4">
                                                <button className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap">
                                                    View Reviews
                                                </button>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => onViewDriver(driver)}
                                                        className="text-green-600 hover:text-green-700 text-sm font-medium whitespace-nowrap"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(driver._id)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium whitespace-nowrap"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <svg
                                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">No pending verification requests</p>
                            <p className="text-gray-400 text-sm mt-2">
                                New driver verification requests will appear here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationRequestsModal;