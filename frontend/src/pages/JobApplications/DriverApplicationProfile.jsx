import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDriverProfile, shortlistApplicant } from "../../features/ownerSlice/ownerSlice";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award, TrendingUp } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const DriverApplicationProfile = () => {
    const { jobId, applicantId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { driverProfile, loading } = useSelector((state) => state.owner);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchDriverProfile(applicantId));
    }, [applicantId, dispatch]);

    const handleShortlist = async () => {
        setActionLoading(true);
        try {
            await dispatch(shortlistApplicant({ jobId, applicantId })).unwrap();
            showToast("Applicant shortlisted successfully!", "success");
            navigate(-1);
        } catch (error) {
            showToast(error || "Failed to shortlist applicant", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center ml-56 mt-16">
                <p className="text-lg font-semibold text-gray-600">Loading profile...</p>
            </div>
        );
    }

    const driver = driverProfile?.profile || driverProfile;

    return (
        <div className="min-h-screen bg-gray-50 ml-56 mt-16 p-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </button>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3565E3] px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">Driver Profile</h2>
                        <p className="text-blue-100 text-sm mt-1">Review applicant details</p>
                    </div>

                    {/* Profile Section */}
                    <div className="px-8 py-6">
                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={driver?.profileImage || "/default-avatar.png"}
                                alt={driver?.fullName}
                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-md"
                            />
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{driver?.fullName || "N/A"}</h3>
                                <p className="text-gray-500 mt-1">{driver?.email || "N/A"}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                        License: {driver?.licenseNumber || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                        <p className="text-sm text-gray-800 font-medium">{driver?.email || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                                        <p className="text-sm text-gray-800 font-medium">{driver?.phoneNumber || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Driver Statistics</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                    <Award className="w-6 h-6 text-blue-600 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{driver?.safetyScore || 0}</p>
                                    <p className="text-xs text-gray-600 font-medium">Safety Score</p>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                    <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{driver?.milesDriven || 0}</p>
                                    <p className="text-xs text-gray-600 font-medium">Miles Driven</p>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                    <Calendar className="w-6 h-6 text-green-600 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{driver?.stats?.totalApplied || 0}</p>
                                    <p className="text-xs text-gray-600 font-medium">Total Applied</p>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                                    <Award className="w-6 h-6 text-orange-600 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{driver?.totalIncidents || 0}</p>
                                    <p className="text-xs text-gray-600 font-medium">Incidents</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShortlist}
                                disabled={actionLoading}
                                className="flex-1 px-6 py-3 bg-[#3565E3] text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                            >
                                {actionLoading ? "Processing..." : "Accept & Shortlist"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverApplicationProfile;