import React from "react";
import { AlertTriangle } from "lucide-react";

const DeleteJobConfirmationModal = ({ isOpen, onClose, onConfirm, jobTitle, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            {/* Modal Box */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg animate-[fadeIn_0.2s_ease]">
                {/* Header */}
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Delete Job
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-gray-600 mb-3">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-gray-800">"{jobTitle}"</span>?
                    </p>
                    <p className="text-sm text-red-600 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>This action cannot be undone.</span>
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg 
                        hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg 
                        hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            "Delete Job"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteJobConfirmationModal;