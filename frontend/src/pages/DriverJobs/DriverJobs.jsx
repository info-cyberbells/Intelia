import React, { useState, useEffect } from "react";
import { Search, MapPin, Truck, DollarSign, SlidersHorizontal, X, Bookmark, BookmarkCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs, saveJob, applyJob, withdrawJob } from "../../features/Jobs/JobsSlice";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../Model/ConfirmationModal";
import WithdrawJobModal from "../Model/WithdrawJobModal";




const JobListingInterface = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { loading, data: jobs, totalPages, currentPage, totalJobs, error } = useSelector(
        (state) => state.jobs
    );

    const driverId = useSelector((state) => state.auth.user?._id);



    const [page, setPage] = useState(1);
    const limit = 10;

    const [city, setCity] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [keyword, setKeyword] = useState("");
    const [showSaved, setShowSaved] = useState(false);
    const [showApplied, setShowApplied] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [jobToApply, setJobToApply] = useState(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [jobToWithdraw, setJobToWithdraw] = useState(null);


    const isFirstRender = React.useRef(true);


    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const delayDebounce = setTimeout(() => {
            dispatch(fetchAllJobs({ page, limit, city, minSalary, maxSalary, keyword }));
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [dispatch, city, minSalary, maxSalary, keyword]);

    const handleSaveJob = async (jobId) => {
        try {
            const res = await dispatch(saveJob({ jobId })).unwrap();
            showToast(res.data?.message || "Job saved successfully", "success");
        } catch (err) {
            showToast(err || "Failed to save job", "error");
        }
    };


    const confirmApply = async () => {
        if (!jobToApply) return;

        try {
            const res = await dispatch(applyJob({ jobId: jobToApply, driverId })).unwrap();
            showToast(res.data?.message || "Applied successfully!", "success");
            setShowApplyModal(false);
            setJobToApply(null);
        } catch (err) {
            showToast(err || "Failed to apply!", "error");
        }
    };

    const confirmWithdraw = async () => {
        if (!jobToWithdraw) return;

        try {
            const res = await dispatch(
                withdrawJob({ jobId: jobToWithdraw, driverId })
            ).unwrap();
            showToast(res.data?.message || "Application withdrawn!", "success");
            setShowWithdrawModal(false);
            setJobToWithdraw(null);
        } catch (err) {
            showToast(err || "Failed to withdraw!", "error");
        }
    };


    // Immediate pagination
    useEffect(() => {
        dispatch(fetchAllJobs({ page, limit, city, minSalary, maxSalary, keyword }));
    }, [dispatch, page]);


    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    };

    const [savedJobs, setSavedJobs] = useState(new Set());


    const toggleSave = (jobId) => {
        setSavedJobs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans lg:ml-56 mt-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                    {/* Search Bar */}
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[250px] max-w-md">
                        <input
                            type="text"
                            placeholder="Search jobs here with title"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-700"
                        />
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>


                    {/* Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* City Filter */}
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        />

                        {/* Min Salary */}
                        <input
                            type="number"
                            placeholder="Min Salary"
                            value={minSalary}
                            onChange={(e) => setMinSalary(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm w-32"
                        />

                        {/* Max Salary */}
                        <input
                            type="number"
                            placeholder="Max Salary"
                            value={maxSalary}
                            onChange={(e) => setMaxSalary(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm w-32"
                        />

                        {/* Saved Jobs Filter */}

                        <button
                            onClick={() => {
                                setShowSaved((prev) => !prev);
                                setShowApplied(false);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${showSaved
                                ? "bg-blue-100 text-blue-700 border-blue-500 shadow-sm"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                }`}
                        >
                            {showSaved ? "Saved Jobs (Active)" : "Saved Jobs"}
                        </button>

                        {/* Applied Jobs Filter */}
                        <button
                            onClick={() => {
                                setShowApplied((prev) => !prev);
                                setShowSaved(false);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${showApplied
                                ? "bg-green-100 text-green-700 border-green-500 shadow-sm"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                }`}
                        >
                            {showApplied ? "Applied Jobs (Active)" : "Applied Jobs"}
                        </button>


                        {/* Reset Filters */}
                        <button
                            onClick={() => {
                                setCity("");
                                setMinSalary("");
                                setMaxSalary("");
                                setKeyword("");
                                setShowSaved(false);
                                setShowApplied(false);
                                setPage(1);

                                dispatch(fetchAllJobs({ page: 1, limit }));
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Reset
                            <X className="w-4 h-4" />
                        </button>


                    </div>

                </div>
            </div>


            {/* Job Cards Grid */}

            <div className="max-w-7xl mx-auto px-6 py-8">
                {(() => {
                    const filteredJobs = jobs.filter((job) => {
                        if (showSaved) return job.isSaved === true;
                        if (showApplied) return job.alreadyApplied === true;
                        return true;
                    });


                    if (loading) {
                        return <div className="text-center py-20 text-gray-600">Loading jobs...</div>;
                    }

                    if (filteredJobs.length === 0) {
                        return (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                                <p className="text-gray-500">
                                    {showSaved ? "You haven't saved any jobs yet" :
                                        showApplied ? "You haven't applied to any jobs yet" :
                                            "Try adjusting your filters"}
                                </p>
                            </div>
                        );
                    }

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredJobs.map((job) => (

                                <div
                                    key={job._id}
                                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                                >
                                    {/* Company Header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-600 text-sm">
                                            {job?.ownerId?.companyName?.[0]?.toUpperCase() || "C"}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {job?.ownerId?.companyName || "Unknown Company"}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {job?.ownerId?.firstName || ""} {job?.ownerId?.surname || ""}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Job Status Badge */}
                                    <div className="mb-3">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${job.status === "open"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {job.status === "open" ? "Open" : "Closed"}
                                        </span>
                                    </div>



                                    {/* Job Title */}
                                    < h4 className="text-base font-semibold text-gray-900 mb-2" > {job.title}</h4>

                                    {/* Job Description */}
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{job.description}</p>

                                    {/* Key Info */}
                                    <div className="mb-4">
                                        <div className="text-xs text-gray-600">
                                            <p>
                                                <span className="font-medium text-gray-700">Key Info:</span>
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 mt-1">
                                                {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                                                    job.requirements.map((req, index) => (
                                                        <li key={index}>{req}</li>
                                                    ))
                                                ) : (
                                                    <li>No specific requirements</li>
                                                )}
                                            </ul>
                                            <p className="mt-2">
                                                <span className="font-medium text-gray-700">Salary:</span>{" "}
                                                ₹{job.salary?.toLocaleString("en-IN") || "Not specified"}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Actions */}

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">

                                        {/* SAVE JOB */}
                                        <button
                                            onClick={() => handleSaveJob(job._id)}
                                            className={`flex items-center gap-2 text-sm font-medium transition ${job.isSaved
                                                ? "text-green-600"   // saved color
                                                : "text-blue-600 hover:text-blue-700"
                                                }`}
                                        >
                                            {job.isSaved ? (
                                                <>
                                                    <BookmarkCheck className="w-4 h-4" />
                                                    Saved
                                                </>
                                            ) : (
                                                <>
                                                    <Bookmark className="w-4 h-4" />
                                                    Save
                                                </>
                                            )}
                                        </button>

                                        {/* APPLY JOB */}
                                        {/* <button
                                            onClick={() => {
                                                setJobToApply(job._id);
                                                setShowApplyModal(true);
                                            }}
                                            className="px-4 py-2 bg-white border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors"
                                            disabled={job.alreadyApplied}
                                        >
                                            {job.alreadyApplied ? "Applied" : "Apply Now"}
                                        </button> */}

                                        {job.applicationStatus === "withdrawn" ? (
                                            // Withdrawn → show disabled button
                                            <button
                                                disabled
                                                className="px-4 py-2 bg-gray-200 border border-gray-300 
                   text-gray-500 text-sm rounded cursor-not-allowed"
                                            >
                                                Withdrawn
                                            </button>
                                        ) : job.alreadyApplied ? (
                                            // Applied → allow withdraw
                                            <button
                                                onClick={() => {
                                                    setJobToWithdraw(job._id);
                                                    setShowWithdrawModal(true);
                                                }}
                                                className="px-4 py-2 bg-red-50 border border-red-600 
                   text-red-600 text-sm rounded hover:bg-red-100 transition-colors"
                                            >
                                                Withdraw
                                            </button>
                                        ) : (
                                            // Not applied → allow apply
                                            <button
                                                onClick={() => {
                                                    setJobToApply(job._id);
                                                    setShowApplyModal(true);
                                                }}
                                                className="px-4 py-2 bg-white border border-blue-600 
                   text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors"
                                            >
                                                Apply Now
                                            </button>
                                        )}


                                    </div>

                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>
            {/* Pagination Footer */}
            {!loading && !error && totalPages >= 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm text-gray-500 ml-5">
                    <p>
                        Page{" "}
                        <span className="text-gray-900 font-semibold">{page}</span> of{" "}
                        <span className="text-gray-600 font-semibold">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        {/* Prev */}
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md ${page === 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            ‹
                        </button>

                        {/* Dynamic page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-8 h-8 rounded-md font-semibold shadow-sm transition-all border ${page === i + 1
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-[#F3CD484A] text-[#F3CD48] border-yellow-200 hover:bg-yellow-200"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        {/* Next */}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md ${page === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )
            }
            <ConfirmationModal
                open={showApplyModal}
                title="Apply for Job"
                message="Are you sure you want to apply for this job?"
                onCancel={() => {
                    setShowApplyModal(false);
                    setJobToApply(null);
                }}
                onConfirm={confirmApply}
            />

            <WithdrawJobModal
                isOpen={showWithdrawModal}
                onClose={() => {
                    setShowWithdrawModal(false);
                    setJobToWithdraw(null);
                }}
                onConfirm={confirmWithdraw}
                jobTitle={jobs.find((j) => j._id === jobToWithdraw)?.title}
            />
        </div >
    );
};

export default JobListingInterface;