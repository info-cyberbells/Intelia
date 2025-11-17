import React, { useState, useEffect } from "react";
import { Trash2, Filter, Download, Plus, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import addicon from "/menuicons/add_circle.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnerJobs, deleteJob } from "../../features/ownerSlice/ownerSlice";
import DeleteJobConfirmationModal from "../Model/DeleteJobConfirmationModal";
import { useToast } from "../../context/ToastContext";
import AddJobSelectionModal from "../Model/AddJobSelectionModal";


const JobListingTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { ownerJobs, loading } = useSelector((state) => state.owner);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);


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

  const handleBulkDeleteClick = () => {
    if (selectedRows.length === 0) {
      showToast("Please select at least one job to delete", "error");
      return;
    }
    setIsBulkDelete(true);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      if (isBulkDelete) {
        for (const id of selectedRows) {
          await dispatch(deleteJob(id)).unwrap();
        }
        showToast(`${selectedRows.length} job(s) deleted successfully`, "success");
        setSelectedRows([]);
      } else {
        await dispatch(deleteJob(selectedJob._id)).unwrap();
        showToast("Job deleted successfully", "success");
      }
      setDeleteModalOpen(false);
      setSelectedJob(null);
      setIsBulkDelete(false);
    } catch (error) {
      showToast(error || "Failed to delete job", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {

    if (selectedRows.length === 0) {
      showToast("Please select at least one job to export", "error");
      return;
    }

    const jobsToExport = selectedRows.length > 0
      ? ownerJobs.filter(job => selectedRows.includes(job._id))
      : ownerJobs;

    if (jobsToExport.length === 0) {
      showToast("No jobs to export", "error");
      return;
    }

    // Prepare CSV headers
    const headers = ["Sr.No", "Title", "Date", "Status", "Total Applicants", "Description", "Salary", "Vacancy", "Location"];

    // Prepare CSV rows
    const rows = jobsToExport.map((job, index) => [
      index + 1,
      `"${job.title || ""}"`,
      new Date(job.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      job.status === "open" ? "Active" : "Inactive",
      job.applicants?.length || 0,
      `"${(job.description || "").replace(/"/g, '""')}"`,
      job.salary || "",
      job.vacancy || "",
      `"${job.location?.city || ""}, ${job.location?.state || ""}, ${job.location?.country || ""}"`
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `job-listings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${jobsToExport.length} job(s) successfully`, "success");
  };


  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === ownerJobs?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(ownerJobs.map((j) => j._id));
    }
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
    <div className="min-h-screen font-[Poppins]  bg-gray-50 ml-56 mt-16 p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Job Listing</h1>
        <button
          onClick={() => setAddJobModalOpen(true)}
          className="px-5 py-3 text-sm bg-[#3565E3] border border-[#3565E3] text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
        >
          Add New Job <img src={addicon} alt="" className="w-5 h-5 filter invert brightness-0" />
        </button>
      </div>


      {ownerJobs?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#3565E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-[#363B64] mb-3">No Jobs Found</h3>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't created any jobs yet. Add your first job to get started.
          </p>

          <button
            onClick={() => setAddJobModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3565E3] text-white font-medium rounded-lg hover:bg-[#2851c7] transition-colors"
          >
            <img src={addicon} alt="" className="w-5 h-5 filter invert brightness-0" />
            Add Your First Job
          </button>

        </div>
      )}

      {ownerJobs?.length > 0 && (
        <>
          {/* Table Container */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Table Header with Actions */}
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center gap-2">
                {/* <h2 className="text-lg font-semibold text-gray-700">Job List</h2>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Label text or value</span> */}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBulkDeleteClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
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
                    <th className="w-12 px-3 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === ownerJobs.length && ownerJobs.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left whitespace-nowrap">

                      <div
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                        Sr.no
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                        Title
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                        Total Applicants
                        {/* <ChevronDown className="w-4 h-4" /> */}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                        Action
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ownerJobs?.map((job, index) => (
                    <tr key={job._id || index}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(job._id)}
                          onChange={() => toggleRowSelection(job._id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />

                      </td>
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
                        <div className="flex justify-start pl-6">
                          <span className="inline-flex items-center justify-center text-sm font-semibold 
      text-blue-600 bg-blue-50 px-3 py-1 rounded-md min-w-[40px]">
                            {job.applicants?.length || 0}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/job-applications/${job._id}`)}
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium whitespace-nowrap"
                          >
                            View
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleEdit(job._id)}
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDeleteClick(job)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium whitespace-nowrap"
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
        </>
      )}

      <DeleteJobConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedJob(null);
          setIsBulkDelete(false);
        }}
        onConfirm={handleDeleteConfirm}
        jobTitle={
          isBulkDelete
            ? `${selectedRows.length} selected job(s)`
            : selectedJob?.title || "this job"
        }
        loading={deleting}
      />

      <AddJobSelectionModal
        isOpen={addJobModalOpen}
        onClose={() => setAddJobModalOpen(false)}
      />
    </div>
  );
};

export default JobListingTable;