import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createJob, fetchOwnerVehicles, fetchSingleJob, updateJob } from "../../features/ownerSlice/ownerSlice";
import { useToast } from "../../context/ToastContext";



const AddJobManually = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading } = useSelector((state) => state.jobs);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { vehicles, currentJob } = useSelector((state) => state.owner);
  const [formData, setFormData] = useState({
    title: "",
    vehicleId: "",
    description: "",
    requirements: "",
    vacancy: "",
    startDate: "",
    endDate: "",
    salary: "",
    location: "",
    state: "",
    city: "",
    country: "",
  });

  const [openSelect, setOpenSelect] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };


 useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      await dispatch(fetchOwnerVehicles());
      setIsInitialLoading(false);
    };
    loadData();
  }, [dispatch]);
  useEffect(() => {
    if (jobId) {
      dispatch(fetchSingleJob(jobId));
    }
  }, [jobId, dispatch]);

  useEffect(() => {
    if (currentJob && jobId) {
      setFormData({
        title: currentJob.title || "",
        vehicleId: currentJob.vehicleId?._id || "",
        description: currentJob.description || "",
        requirements: currentJob.requirements?.join(", ") || "",
        vacancy: currentJob.vacancy?.toString() || "",
        startDate: currentJob.startDate?.split('T')[0] || "",
        endDate: currentJob.endDate?.split('T')[0] || "",
        salary: currentJob.salary?.toString() || "",
        location: currentJob.location?.city || "",
        state: currentJob.location?.state || "",
        city: currentJob.location?.city || "",
        country: currentJob.location?.country || "",
      });
    }
  }, [currentJob, jobId]);


 // NOW CHECK isInitialLoading FIRST
  if (isInitialLoading) {
    return (
      <div className="ml-56 mt-16 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3565E3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // SECOND: Check if no vehicles 
  if (vehicles?.length === 0 && !jobId) {
    return (
      <div className="ml-56 mt-16 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Vehicles Available</h3>
            <p className="text-gray-600 mb-6">
              You need to add at least one vehicle before creating a job posting.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate('/my-vehicle')}
                className="px-6 py-2 bg-[#3565E3] text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = true;
    if (!formData.vehicleId.trim()) errors.vehicleId = true;
    if (!formData.description.trim()) errors.description = true;
    if (!formData.startDate.trim()) errors.startDate = true;
    if (!formData.endDate.trim()) errors.endDate = true;
    if (!formData.requirements.trim()) errors.requirements = true;
    if (!formData.vacancy.trim()) errors.vacancy = true;
    if (!formData.salary.trim()) errors.salary = true;
    if (!formData.location.trim()) errors.location = true;
    if (!formData.state.trim()) errors.state = true;
    if (!formData.city.trim()) errors.city = true;
    if (!formData.country.trim()) errors.country = true;

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("Please fill all required fields", "error");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const jobData = {
      title: formData.title,
      description: formData.description,
      vehicleId: formData.vehicleId,
      vacancy: Number(formData.vacancy),
      startDate: formData.startDate,
      endDate: formData.endDate,
      salary: Number(formData.salary),
      requirements: formData.requirements
        ? formData.requirements.split(",").map((i) => i.trim())
        : [],
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country,
      }
    };

    try {
      if (jobId) {
        await dispatch(updateJob({ jobId, jobData })).unwrap();
        showToast("Job updated successfully!", "success");
      } else {
        await dispatch(createJob(jobData)).unwrap();
        showToast("Job created successfully!", "success");
      }
      navigate(-1);
    } catch (err) {
      showToast(err || `Failed to ${jobId ? 'update' : 'create'} job`, "error");
    }
  };

  return (
    <div className="ml-56 mt-16 p-10 bg-[#F9F9FA] rounded-3xl shadow-sm">
      <h2 className="text-[#3565E3] text-2xl font-bold mb-2">   {jobId ? "Edit Job" : "Add New Job"}</h2>
      <p className="text-base text-[#868686] mb-8">
        {jobId ? "Update your job details." : "Create your job ads manually."}
      </p>
      <div className="w-full max-w-4xl px-8 py-8 bg-white shadow-sm rounded-xl">
        <form onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Heavy Vehicle Driver / Delivery Driver"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.title ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}
            />
          </div>

          {/* Vehicle ID */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">Vehicle</label>

            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm bg-white text-[#718EBF]
${fieldErrors.vehicleId ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}

            >
              <option value="">Select a Vehicle</option>

              {vehicles?.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.make} {v.model} — Plate: {v.plateNo || "N/A"}
                </option>
              ))}
            </select>
          </div>


          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="Describe the job role, responsibilities, and nature of work"
              value={formData.description}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.description ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}

            ></textarea>
          </div>

          {/* Requirements */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Requirements
            </label>
            <textarea
              name="requirements"
              rows="3"
              placeholder="Add requirements separated by commas (e.g., Valid License, 2+ years experience)"
              value={formData.requirements}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.requirements ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}
            ></textarea>
          </div>

          {/* Vacancy */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Vacancy
            </label>
            <input
              type="text"
              name="vacancy"
              placeholder="Number of openings (e.g., 3)"
              value={formData.vacancy}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.vacancy ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm
${fieldErrors.startDate ? "border-red-500 bg-red-50" : "border-gray-200 text-[#718EBF]"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}

            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm
${fieldErrors.endDate ? "border-red-500 bg-red-50" : "border-gray-200 text-[#718EBF]"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}

            />
          </div>

          {/* Salary */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">Salary</label>
            <input
              type="text"
              name="salary"
              placeholder="Monthly salary in INR (e.g., 25000)"
              value={formData.salary}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.salary ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}

            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Full job location (e.g., Andheri East, Mumbai)"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.location ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">State</label>
            <input
              type="text"
              name="state"
              placeholder="e.g., Maharashtra"
              value={formData.state}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.state ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}
            />
          </div>


          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g., Mumbai"
              value={formData.city}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.city ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}

            />
          </div>


          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">Country</label>
            <input
              type="text"
              name="country"
              placeholder="e.g., India"
              value={formData.country}
              onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2.5 mt-1 text-sm text-[#718EBF]
${fieldErrors.country ? "border-red-500 bg-red-50" : "border-gray-200"}
focus:ring-1 focus:ring-[#DFEAF2] outline-none`}
            />
          </div>

          <div className="flex justify-center items-center gap-6 mt-8 col-span-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-2 text-[#3565E3] border border-[#3565E3] rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-2 text-white rounded-xl ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#3565E3]"
                }`}
            >
              {loading ? "Submitting..." : (jobId ? "Update Job" : "Submit")}
            </button>

          </div>

        </form>


      </div>
    </div>
  );
};

export default AddJobManually;
