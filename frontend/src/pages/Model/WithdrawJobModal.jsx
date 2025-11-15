import React from "react";

const WithdrawApplicationModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">

            {/* Modal Box */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg animate-[fadeIn_0.2s_ease]">

                {/* Header */}
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Withdraw Application
                    </h2>

                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-gray-600">
                        Are you sure you want to withdraw your application for{" "}
                        <span className="font-semibold text-gray-800">{jobTitle}</span>?
                        <br />
                        This action cannot be undone.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg 
                        hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg 
                        hover:bg-red-700 transition"
                    >
                        Withdraw
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WithdrawApplicationModal;
