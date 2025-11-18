import React from "react";
import {
  X,
  Briefcase,
  Building,
  Mail,
  Car,
  Calendar,
  Users,
  CheckCircle,
  MapPin,
  FileText,
  ListChecks,
  Clock,
  User,
  DollarSign, 
  AlertTriangle, 
  Banknote,
} from "lucide-react";

// A small helper component for rendering details in the main grid
// This makes the grid cleaner and more consistent
const DetailItem = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
    <Icon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  </div>
);

const JobDetailsModal = ({ open, onClose, job }) => {
  if (!open || !job) return null;

  const totalApplicants = job?.applicants?.length || 0;

  // Helper for formatting dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
      {/* Modal Box */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto job-modal-scroll 
                    rounded-2xl bg-white shadow-2xl
                    border border-gray-200 p-6 md:p-8"
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition
                     rounded-full p-1.5 hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {/* Main Title with Icon */}
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-7 h-7 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {job.title || "Job Details"}
          </h2>
        </div>

        {/* OWNER INFO BOX */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <img
            src={
              job.owner?.profileImage ||
              job.ownerId?.profileImage ||
              "https://placehold.co/100x100/e2e8f0/64748b?text=User"
            }
            alt="owner"
            className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-md flex-shrink-0"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/100x100/e2e8f0/64748b?text=User";
            }}
          />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <p className="text-lg font-semibold text-gray-800">
                {job.owner?.fullName || job.ownerId?.fullName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <p className="text-gray-600 text-sm">
                {job.owner?.email || job.ownerId?.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-500" />
              <p className="text-gray-600 text-sm">
                {job.owner?.companyName || job.ownerId?.companyName}
              </p>
            </div>
          </div>
        </div>

        {/* VEHICLE BOX */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-blue-800 mb-3 text-base">
            <Car className="w-5 h-5" />
            Vehicle Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
            <p>
              <span className="font-medium text-gray-500">Make:</span>{" "}
              {job.vehicle?.make}
            </p>
            <p>
              <span className="font-medium text-gray-500">Model:</span>{" "}
              {job.vehicle?.model}
            </p>
            <p>
              <span className="font-medium text-gray-500">Plate No:</span>{" "}
              {job.vehicle?.plateNo}
            </p>
          </div>
        </div>

        {/* MAIN JOB GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
          <DetailItem icon={Building} label="Company">
            {job.owner?.companyName}
          </DetailItem>

          <DetailItem icon={Clock} label="Created At">
            {formatDate(job.createdAt)}
          </DetailItem>

          <DetailItem icon={Calendar} label="Start Date">
            {formatDate(job.startDate)}
          </DetailItem>

          <DetailItem icon={Calendar} label="End Date">
            {formatDate(job.endDate)}
          </DetailItem>

          <DetailItem icon={Users} label="Vacancy">
            {job.vacancy}
          </DetailItem>

          <DetailItem icon={Users} label="Total Applicants">
            {totalApplicants}
          </DetailItem>
          
          <DetailItem
            icon={job.status === "open" ? CheckCircle : AlertTriangle}
            label="Status"
          >
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                job.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {job.status}
            </span>
          </DetailItem>

          <DetailItem icon={Banknote} label="Salary">
            {job.salary ? `$ ${job.salary.toLocaleString()}` : 'N/A'}
          </DetailItem>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-1.5">
            <FileText className="w-5 h-5 text-indigo-500" />
            Description
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* LOCATION */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-1.5">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Location
          </h3>
          <p className="text-gray-700 text-sm">
            {job.location?.city}, {job.location?.state},{" "}
            {job.location?.country}
          </p>
        </div>

        {/* REQUIREMENTS */}
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-1.5">
            <ListChecks className="w-5 h-5 text-indigo-500" />
            Requirements
          </h3>
          <ul className="list-disc ml-6 mt-1 space-y-1">
            {job.requirements?.map((req, idx) => (
              <li key={idx} className="text-gray-700 text-sm">
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SCROLLBAR-HIDE ONLY FOR THIS MODAL */}
      <style>
        {`
          .job-modal-scroll::-webkit-scrollbar {
            display: none;
          }
          .job-modal-scroll {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
    </div>
  );
};

export default JobDetailsModal;