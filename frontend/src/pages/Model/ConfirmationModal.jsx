import React from "react";
import { X } from "lucide-react";

const ConfirmationModal = ({ open, title, message, onCancel, onConfirm }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">

            {/* Modal Box */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">

                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {title || "Are you sure?"}
                </h2>

                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                    {message || "Do you want to proceed with this action?"}
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">

                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                        Confirm
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
