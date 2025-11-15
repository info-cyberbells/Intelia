import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobManually = () => {
  const navigate = useNavigate();

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form Data:", formData);
};


  return (
    <div className="ml-56 mt-16 p-10 bg-[#F9F9FA] rounded-3xl shadow-sm">
      <h2 className="text-[#3565E3] text-2xl font-bold mb-2">Talent Hub</h2>
      <p className="text-base text-[#868686] mb-8">
        Create your job ads manually.
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
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 
            focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
            />
          </div>

          {/* Vehicle ID */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Vehicle Id
            </label>
            <input
              type="text"
              name="vehicleId"
              placeholder="CA093034"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 
            focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="Enter job description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 
            focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
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
              placeholder="Enter your requirements here"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 
            focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
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
              placeholder="Long Route Driver"
              value={formData.vacancy}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 
            focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
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
              className={`w-full border border-gray-200 rounded-xl 
${formData.startDate ? "text-[#718EBF]" : "text-gray-400"} 
focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm`}
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
              className={`w-full border border-gray-200 rounded-xl 
${formData.endDate ? "text-[#718EBF]" : "text-gray-400"} 
focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm`}
            />
          </div>

          {/* Salary */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">Salary</label>
            <input
              type="text"
              name="salary"
              placeholder="$3000"
              value={formData.salary}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 
            focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
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
              placeholder="Choose a location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 
            focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
            />
          </div>

          {/* STATE */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-[#424242] font-medium">State</label>

            <div className="relative">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                onClick={() =>
                  setOpenSelect(openSelect === "state" ? "" : "state")
                }
                className={`w-full appearance-none border border-gray-200 rounded-xl 
${formData.state ? "text-[#718EBF]" : "text-gray-400"} 
focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm bg-white`}
              >
                <option className="" value="">
                  Select a state
                </option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
              </select>

              {/* Arrow Icon */}
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                {openSelect === "state" ? (
                  // Chevron Up
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      stroke="#718EBF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 15L12 9L6 15"
                    />
                  </svg>
                ) : (
                  // Chevron Down
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      stroke="#718EBF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9L12 15L18 9"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* CITY */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-[#424242] font-medium">City</label>

            <div className="relative">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                onClick={() =>
                  setOpenSelect(openSelect === "city" ? "" : "city")
                }
                className={`w-full appearance-none border border-gray-200 rounded-xl 
${formData.city ? "text-[#718EBF]" : "text-gray-400"} 
focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm bg-white`}
              >
                <option value="">Select a city</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Houston">Houston</option>
                <option value="Miami">Miami</option>
              </select>

              {/* Arrow Icon */}
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                {openSelect === "city" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      stroke="#718EBF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 15L12 9L6 15"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      stroke="#718EBF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9L12 15L18 9"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* COUNTRY */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-[#424242] font-medium">
              Country
            </label>

            <div className="relative">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                onClick={() =>
                  setOpenSelect(openSelect === "country" ? "" : "country")
                }
                className={`w-full appearance-none border border-gray-200 rounded-xl 
${formData.country ? "text-[#718EBF]" : "text-gray-400"} 
focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm bg-white`}
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>

              {/* Arrow Icon */}
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                {openSelect === "country" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      stroke="#718EBF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 15L12 9L6 15"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      stroke="#718EBF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9L12 15L18 9"
                    />
                  </svg>
                )}
              </span>
            </div>
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
            className="px-8 py-2 bg-[#3565E3] border-[#3565E3] text-white rounded-xl"
          >
            Submit
          </button>
        </div>

        </form>


      </div>
    </div>
  );
};

export default AddJobManually;
