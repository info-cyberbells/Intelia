import React from "react";
import { X } from "lucide-react";

const ConfirmationModal = ({ open, onCancel, onConfirm, jobData, loading }) => {
    if (!open) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 flex flex-col items-center gap-4">

                    {/* Animated Loader */}
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-600 text-sm tracking-wide">
                        Fetching job details...
                    </p>
                </div>
            </div>
        );
    }


    if (!jobData) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
                <button onClick={onCancel} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>

                <div className="space-y-3 text-sm text-gray-700">
                    <div>
                        <p className="font-semibold">Title:</p>
                        <p>{jobData.title}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Description:</p>
                        <p>{jobData.description}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Owner:</p>
                        <p>{jobData.ownerId?.fullName} — {jobData.ownerId?.companyName}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Vehicle:</p>
                        <p>{jobData.vehicleId?.make} {jobData.vehicleId?.model}</p>
                        <p>Plate No: {jobData.vehicleId?.plateNo}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Location:</p>
                        <p>{jobData.location?.city}, {jobData.location?.state}, {jobData.location?.country}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Salary:</p>
                        <p>₹ {jobData.salary?.toLocaleString("en-IN")}</p>
                    </div>

                    <div className="flex gap-20">
                        <div>
                            <p className="font-semibold">Start Date:</p>
                            <p>{new Date(jobData.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold">End Date:</p>
                            <p>{new Date(jobData.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold">Requirements:</p>
                        <ul className="list-disc ml-6">
                            {jobData.requirements?.map((req, i) => (
                                <li key={i}>{req}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-5">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;