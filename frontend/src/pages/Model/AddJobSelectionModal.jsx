import React from "react";
import { X, Sparkles, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddJobSelectionModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAIRoute = () => {
        navigate("/create-job-with-ai");
        onClose();
    };

    const handleManualRoute = () => {
        navigate("/add-job-manually");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Job</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-gray-600 mb-8 text-center">
                        Choose how you'd like to create your job posting
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* AI Option */}
                        <button
                            onClick={handleAIRoute}
                            className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Create with AI
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Let AI help you generate a professional job posting quickly and efficiently
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                    <Sparkles className="w-3 h-3" />
                                    Recommended
                                </span>
                            </div>
                        </button>

                        {/* Manual Option */}
                        <button
                            onClick={handleManualRoute}
                            className="group relative bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Edit3 className="w-8 h-8 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Create Manually
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Fill out the job details yourself with complete control over every field
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                    Traditional
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        You can always edit your job posting after creation
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddJobSelectionModal;