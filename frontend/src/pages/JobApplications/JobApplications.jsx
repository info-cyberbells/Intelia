import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobApplications } from "../../features/ownerSlice/ownerSlice";
import { ArrowLeft } from "lucide-react";

const JobApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { jobApplications, loading } = useSelector((state) => state.owner);

    useEffect(() => {
        dispatch(fetchJobApplications(jobId));
    }, [jobId, dispatch]);

    const getStatusBadge = (status) => {
        const config = {
            accepted: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
            applied: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-600" },
            withdrawn: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-600" },
            rejected: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-600" },
        };
        const c = config[status] || config.applied;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center ml-56 mt-16">
                <p className="text-lg font-semibold text-gray-600">Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ml-56 mt-16 p-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Job Applications</h1>
                    <p className="text-gray-600 mt-1">
                        Total Applications: <span className="font-semibold">{jobApplications?.totalApplications || 0}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="text-xs font-semibold text-gray-600 uppercase">Sr.No</div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="text-xs font-semibold text-gray-600 uppercase">Driver Name</div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="text-xs font-semibold text-gray-600 uppercase">Email</div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="text-xs font-semibold text-gray-600 uppercase">Applied Date</div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="text-xs font-semibold text-gray-600 uppercase">Status</div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="text-xs font-semibold text-gray-600 uppercase">Action</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {jobApplications?.applicants?.map((app, index) => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={app.driverId?.profileImage || "/default-avatar.png"}
                                                alt={app.driverId?.fullName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <span className="text-sm font-medium text-gray-900">
                                                {app.driverId?.fullName || "N/A"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {app.driverId?.email || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate(`/driver-application/${jobId}/${app.driverId?._id}`)}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!jobApplications?.applicants?.length && (
                    <div className="text-center py-10 text-gray-500">
                        No applications yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;