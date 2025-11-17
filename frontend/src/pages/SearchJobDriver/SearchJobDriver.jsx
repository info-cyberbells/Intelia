import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { applyJob, withdrawJob, saveJob } from "../../features/Jobs/JobsSlice";
import { useToast } from "../../context/ToastContext";
import { MapPin, Calendar, DollarSign, Bookmark, BookmarkCheck, ArrowLeft } from "lucide-react";


const SearchJobDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const job = location.state?.job;
    const [fadeOut, setFadeOut] = useState(false);
    const driverId = useSelector((state) => state.auth.user?._id);

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Job Found</h2>
                    <p className="text-gray-600 mb-4">Please search for a job first</p>
                    <button
                        onClick={() => navigate("/driver-jobs")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Browse All Jobs
                    </button>
                </div>
            </div>
        );
    }

    const userApplication = job.applicants?.find(
        applicant => applicant.driverId === driverId
    );
    const hasApplied = userApplication && userApplication.status !== "withdrawn";

    const handleApply = async () => {
        try {
            const res = await dispatch(applyJob({ jobId: job._id, driverId })).unwrap();
            showToast(res.data?.message || "Job applied successfully!", "success");

            setFadeOut(true);
            setTimeout(() => navigate("/my-applications"), 400);

        } catch (err) {
            showToast(err || "Failed to apply!", "error");
        }
    };

    const handleWithdraw = async () => {
        try {
            const res = await dispatch(withdrawJob({ jobId: job._id, driverId })).unwrap();
            showToast(res.data?.message || "Application withdrawn!", "success");
            setFadeOut(true);
            setTimeout(() => navigate("/driver-jobs"), 400);
        } catch (err) {
            showToast(err || "Failed to withdraw!", "error");
        }
    };

    const handleSave = async () => {
        if (job.isSaved) {
            showToast("Job is already saved", "info");
            return;
        }
        try {
            const res = await dispatch(saveJob({ jobId: job._id })).unwrap();
            showToast(res.data?.message || "Job saved successfully", "success");
            job.isSaved = true;
            setFadeOut(true);
            setTimeout(() => {
                navigate("/search-job-details", { state: { job }, replace: true });
            }, 400);
        } catch (err) {
            showToast(err || "Failed to save job", "error");
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 lg:ml-56 mt-20 px-6 py-8 ${fadeOut ? "fade-out" : ""}`}>
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                {/* Job Card */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                                {job.ownerId?.companyName?.[0]?.toUpperCase() || "C"}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                                <p className="text-gray-600">{job.ownerId?.companyName}</p>
                                <p className="text-sm text-gray-500">
                                    {job.ownerId?.fullName}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`px-4 py-1 rounded-full text-sm font-medium ${job.status === "open"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {job.status === "open" ? "Open" : "Closed"}
                            </span>
                            {job.isExpired && (
                                <span className="px-4 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                    Expired
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <p className="font-semibold text-gray-800">Location</p>
                                <p className="text-gray-600">
                                    {job.location?.city}, {job.location?.state}, {job.location?.country}
                                </p>
                            </div>
                        </div>

                        {/* Salary */}
                        <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 text-green-600 mt-1" />
                            <div>
                                <p className="font-semibold text-gray-800">Salary</p>
                                <p className="text-gray-600">₹ {job.salary?.toLocaleString("en-IN")}</p>
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                            <div>
                                <p className="font-semibold text-gray-800">Start Date</p>
                                <p className="text-gray-600">
                                    {new Date(job.startDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-orange-600 mt-1" />
                            <div>
                                <p className="font-semibold text-gray-800">End Date</p>
                                <p className="text-gray-600">
                                    {new Date(job.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Vehicle Information</h3>
                        <p className="text-gray-700">
                            <span className="font-medium">Make & Model:</span> {job.vehicleId?.make} {job.vehicleId?.model}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Plate No:</span> {job.vehicleId?.plateNo}
                        </p>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {job.requirements?.map((req, i) => (
                                <li key={i}>{req}</li>
                            ))}
                        </ul>
                    </div>


                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-6 border-t">
                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={job.isSaved}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${job.isSaved
                                ? "bg-green-100 text-green-700 cursor-default"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                        >
                            {job.isSaved ? (
                                <>
                                    <BookmarkCheck className="w-5 h-5" />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <Bookmark className="w-5 h-5" />
                                    Save Job
                                </>
                            )}
                        </button>

                        {/* Apply/Withdraw Button */}
                        {hasApplied ? (
                            <button
                                onClick={handleWithdraw}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                            >
                                Withdraw Application
                            </button>
                        ) : (
                            <button
                                onClick={handleApply}
                                disabled={job.status !== "open" || job.isExpired}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {job.status !== "open" ? "Job Closed" : job.isExpired ? "Job Expired" : "Apply Now"}
                            </button>
                        )}
                    </div>

                    {/* Application Status */}
                    {hasApplied && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-800 font-medium">
                                ✓ You have already applied for this job
                            </p>
                            <p className="text-sm text-blue-600">
                                Applied on: {new Date(userApplication.appliedAt).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchJobDetails;