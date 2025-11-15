import React, { useState, useEffect } from "react";
import { Trash2, Filter, Download, Plus, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import addicon from "/menuicons/add_circle.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnerJobs, deleteJob } from "../../features/ownerSlice/ownerSlice";
import DeleteJobConfirmationModal from "../Model/DeleteJobConfirmationModal";
import { useToast } from "../../context/ToastContext";



const JobListingTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { ownerJobs, loading } = useSelector((state) => state.owner);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchOwnerJobs());
    }, [dispatch]);

    const handleEdit = (jobId) => {
        navigate(`/edit-job-manually/${jobId}`);
    };



    const handleDeleteClick = (job) => {
        setSelectedJob(job);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await dispatch(deleteJob(selectedJob._id)).unwrap();
            showToast("Job deleted successfully", "success");
            setDeleteModalOpen(false);
            setSelectedJob(null);
        } catch (error) {
            showToast(error || "Failed to delete job", "error");
        } finally {
            setDeleting(false);
        }
    };

    const handleAction = (action, id) => {
        console.log(`${action} job with id: ${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center ml-56 mt-16">
                <p className="text-lg font-semibold text-gray-600">
                    Loading jobs...
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 ml-56 mt-16 p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Job Listing</h1>
                <Link
                    to={`/add-job-manually`}
                    className="px-5 py-3 text-sm bg-[#3565E3] border border-[#3565E3] text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition">
                    Add New Job <img src={addicon} alt="" className="w-5 h-5 filter invert brightness-0" /> </Link>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header with Actions */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        {/* <h2 className="text-lg font-semibold text-gray-700">Job List</h2>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Label text or value</span> */}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Delete</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">Filters</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            <span className="text-sm font-medium">Export</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                                        Sr.no
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                                        Title
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                                        Date
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                                        Status
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                                        Total Applicants
                                        {/* <ChevronDown className="w-4 h-4" /> */}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase">
                                        Action
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ownerJobs?.map((job, index) => (
                                <tr key={job._id || index}
                                    className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-[200px] truncate">
                                        {job.title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        <div className="flex items-center gap-2">

                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(job.createdAt).toLocaleDateString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </div>
                                    </td>


                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${job.status === "Active"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${job.status === "open" ? "bg-green-600" : "bg-gray-500"
                                                    }`}
                                            ></span>
                                            {job.status === "open" ? "Active" : "Inactive"}

                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center justify-center text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md min-w-[40px]">
                                            {job.applicants?.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/job-applications/${job._id}`)}
                                                className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                            >
                                                View
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                onClick={() => handleEdit(job._id)}
                                                className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                onClick={() => handleDeleteClick(job)}
                                                className="text-sm text-gray-700 hover:text-red-600 font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </span>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteJobConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedJob(null);
                }}
                onConfirm={handleDeleteConfirm}
                jobTitle={selectedJob?.title || "this job"}
                loading={deleting}
            />
        </div>
    );
};

export default JobListingTable;