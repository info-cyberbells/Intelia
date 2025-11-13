import React from 'react';
import { X } from 'lucide-react';

const PendingDriverDetailModal = ({ isOpen, onClose, driver, onApprove, onReject }) => {
    if (!isOpen || !driver) return null;

    const handleApprove = () => {
        onApprove(driver._id);
        onClose();
    };

    const handleReject = () => {
        onReject(driver._id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 
    bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-blue-800/90 text-white">
                    <h2 className="text-xl font-bold">Driver Account Verification</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>



                {/* Content */}
                <div className="overflow-y-auto flex-1 p-8">
                    <div className="space-y-6">
                        {/* Driver Information Section */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img
                                        src={driver.profileImage || "https://via.placeholder.com/100?text=D"}
                                        alt={driver.fullName}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{driver.fullName || "Unknown"}</h3>
                                    <p className="text-sm text-gray-500">{driver.email || "N/A"}</p>
                                </div>
                            </div>

                            {/* Driver Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Municipality
                                    </label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {driver.municipality || "North Carolina"}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Driving License Number
                                    </label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {driver.licenseNumber || "5515 4319 8558"}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Phone Number
                                    </label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {driver.phoneNumber || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Valid Until
                                    </label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {driver.validUntil
                                            ? new Date(driver.validUntil).toLocaleDateString("en-US", {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : "20 July 2040"}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Registered On
                                    </label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {new Date(driver.createdAt).toLocaleDateString("en-US", {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Status
                                    </label>
                                    <div className="mt-1">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                            Inactive
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        {driver.address && (
                            <div className="bg-gray-50 rounded-lg p-6">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Address
                                </label>
                                <p className="text-sm font-medium text-gray-800 mt-2">
                                    {driver.address}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with Actions */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={handleReject}
                        className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors text-sm"
                    >
                        Deny
                    </button>
                    <button
                        onClick={handleApprove}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                        Approve
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PendingDriverDetailModal;