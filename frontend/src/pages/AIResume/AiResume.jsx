import React, { useState } from "react";

const DriverResumeForm = () => {
  const tabs = [
    "Basic Info",
    "Experience",
    "Skills & Preferences",
    "AI Resume Preview",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    municipality: "",
    dob: "",
    licenseNumber: "",
    expiry: "",
    company: "",
    startDate: "",
    endDate: "",
    vehicleType: "",
    routeType: "",
    description: "",
    skills: [],
    preferences: "",
    licensePhoto: null,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = (e) => {
    e?.preventDefault();
    if (activeStep < tabs.length - 1) {
      setTimeout(() => setActiveStep((prev) => prev + 1), 0);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // alert("Form data saved successfully!");
  };

  return (
    <main className="ml-56 mt-16 min-h-screen bg-[#F5F5F5] p-8 font-inter flex flex-col justify-between">
      <div className="p-8 rounded-2xl bg-white border border-[#DDE2E5]">
        <form
          onSubmit={handleSubmit}
          className=" min-h-[70vh]  pb-4 flex flex-col justify-between"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 mb-6">
              <div className="flex space-x-8 text-sm font-normal">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`pb-2 font-[Inter] transition-colors ${
                      activeStep === index
                        ? "text-[#3565E3] border-b-2 border-[#3565E3]"
                        : "text-[#718EBF] "
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p className="flex text-sm text-gray-400">
                <span className="text-[#3565E3] mr-1">
                  {" "}
                  Step {activeStep + 1}{" "}
                </span>{" "}
                of {tabs.length}
              </p>
            </div>

            {/* TAB CONTENT */}
            {tabs[activeStep] === "Basic Info" && (
              <div className="grid grid-cols-2 gap-6 font-[Inter]">
                <div>
                  <label className="text-sm text-[#232323]">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Charlene Reed"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Charlene Reed"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="charlenereed@gmail.com"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">Municipality</label>
                  <input
                    type="text"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleChange}
                    placeholder="San Jose, California, USA"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="12ABC3400"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">
                    License Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="**********"
                    className=" mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                {/* <div>
                  <label className="text-sm text-[#232323]">
                    Upload License Photo
                  </label>
                  <div className="mt-1 flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-md text-gray-400 text-sm">
                    Upload Photo
                  </div>
                </div> */}

                <div></div>

                <div className="lg:col-span-2">
                  <label className="text-sm text-[#232323]">
                    Upload License Photo
                  </label>

                  {/* Upload Zone */}
                  <label
                    htmlFor="licensePhoto"
                    className={`mt-2 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition
                        ${
                          formData.licensePhoto
                            ? "border-[#A7C8E7] bg-[#F8FBFD]"
                            : "border-[#DFEAF2] hover:bg-[#F8FBFD]"
                        }`}
                  >
                    {formData.licensePhoto ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.licensePhoto)}
                          alt="License Preview"
                          className="h-32 w-auto rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              licensePhoto: null,
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center text-[#718EBF]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#718EBF"
                          className="w-8 h-8 mb-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5V19.5A1.5 1.5 0 004.5 21H19.5A1.5 1.5 0 0021 19.5V16.5M16.5 12L12 16.5M12 16.5L7.5 12M12 16.5V3"
                          />
                        </svg>
                        <p className="text-sm">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-[#A8B1C5] mt-1">
                          PNG, JPG (max 5MB)
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Hidden File Input */}
                  <input
                    id="licensePhoto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("File size must be less than 5MB");
                          return;
                        }
                        setFormData((prev) => ({
                          ...prev,
                          licensePhoto: file,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {tabs[activeStep] === "Experience" && (
              <div className="grid grid-cols-2 gap-6 font-[Inter]">
                <div>
                  <label className="text-sm text-[#232323]">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Charlene Reed"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">Start Date</label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    placeholder="Charlene Reed"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#23232]">End Date</label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    placeholder="charlenereed@gmail.com"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#232323]">Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    placeholder="2-wheeler / LMV / HMV etc."
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                {/* <div>
                  <label className="text-sm text-[#232323]">Route Type</label>
                  <select
                    name="routeType"
                    value={formData.routeType}
                    onChange={handleChange}
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  >
                    <option value="">Select...</option>
                    <option>City</option>
                    <option>Interstate</option>
                    <option>Local Delivery</option>
                    <option>Highway</option>
                  </select>
                </div> */}

                <div className="relative">
                  <label className="text-sm text-[#232323]">Route Type</label>

                  <div className="relative">
                    <select
                      name="routeType"
                      value={formData.routeType}
                      onChange={handleChange}
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      onBlur={() => setIsDropdownOpen(false)}
                      className="appearance-none mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2] pr-10"
                    >
                      <option value="">Select...</option>
                      <option>City</option>
                      <option>Interstate</option>
                      <option>Local Delivery</option>
                      <option>Highway</option>
                    </select>

                    {/* Custom Chevron Icon */}
                    <div className="absolute right-3 pt-1 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#718EBF"
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 9l6 6 6-6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-[#232323]">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write something about your experience"
                    rows="4"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  ></textarea>
                </div>
              </div>
            )}

            {tabs[activeStep] === "Skills & Preferences" && (
              <div className="grid grid-cols-2 gap-6">
                {/* <div>
                  <label className="text-sm text-[#232323]">Skills</label>
                  <select
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  >
                    <option value="">Select...</option>
                    <option>City</option>
                    <option>Interstate</option>
                    <option>Local Delivery</option>
                    <option>Highway</option>
                  </select>
                </div> */}

                <div className="relative">
                  <label className="text-sm text-[#232323]">Skills</label>

                  {/* Dropdown trigger */}
                  <div
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm bg-white cursor-pointer flex justify-between items-center focus:outline-none"
                  >
                    <span>
                      {formData.skills && formData.skills.length > 0
                        ? "Skills Selected"
                        : "Select skills..."}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#718EBF"
                      className={`w-5 h-5 transform transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </div>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-[#DFEAF2] rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {[
                        "Safe Driving",
                        "Route Knowledge",
                        "Delivery Management",
                        "Customer Handling",
                        "Time Management",
                        "Vehicle Maintenance",
                        "Long Distance Driving",
                        "Navigation (Google Maps)",
                        "Heavy Vehicle Operation",
                      ].map((skill) => (
                        <label
                          key={skill}
                          className="flex items-center px-4 py-2 text-sm text-[#718EBF] hover:bg-[#F8FBFD] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.skills?.includes(skill)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => ({
                                ...prev,
                                skills: checked
                                  ? [...(prev.skills || []), skill]
                                  : prev.skills.filter((s) => s !== skill),
                              }));
                            }}
                            className="mr-2 accent-[#3565E3] w-4 h-4"
                          />
                          {skill}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Selected tags */}
                  {formData.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-[#E6EEFF] text-[#3565E3] text-xs font-medium rounded-full flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                skills: prev.skills.filter((s) => s !== skill),
                              }))
                            }
                            className="text-[#3565E3] hover:text-[#1E40AF]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-[#232323]">
                    Additional Preferences
                  </label>
                  <input
                    type="text"
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    placeholder="Add Your Preferences"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>
              </div>
            )}

            {tabs[activeStep] === "AI Resume Preview" && (
  <div className="grid grid-cols-2 gap-6 font-[Inter]">
    {/* ---------- Basic Info ---------- */}
    <h3 className="col-span-2 text-lg font-semibold text-[##232323] mb-2">
      Basic Info
    </h3>

    <div>
      <label className="text-sm text-[#232323]">First Name</label>
      <input
        type="text"
        readOnly
        value={formData.firstName || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">Last Name</label>
      <input
        type="text"
        readOnly
        value={formData.lastName || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">Email</label>
      <input
        type="email"
        readOnly
        value={formData.email || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">Municipality</label>
      <input
        type="text"
        readOnly
        value={formData.municipality || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">Date of Birth</label>
      <input
        type="text"
        readOnly
        value={formData.dob || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">License Number</label>
      <input
        type="text"
        readOnly
        value={formData.licenseNumber || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">License Expiry Date</label>
      <input
        type="text"
        readOnly
        value={formData.expiry || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    {/* ---------- License Photo ---------- */}
    {formData.licensePhoto && (
      <div className="col-span-2 mt-4">
        <label className="text-sm text-[#232323]">Uploaded License Photo</label>
        <img
          src={URL.createObjectURL(formData.licensePhoto)}
          alt="License"
          className="h-40 rounded-xl object-contain border border-[#DFEAF2] shadow-sm mt-2"
        />
      </div>
    )}

    {/* ---------- Experience ---------- */}
    <h3 className="col-span-2 text-lg font-semibold text-[#232323] mt-6 mb-2">
      Experience
    </h3>

    <div>
      <label className="text-sm text-[#232323]">Company Name</label>
      <input
        type="text"
        readOnly
        value={formData.company || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">Vehicle Type</label>
      <input
        type="text"
        readOnly
        value={formData.vehicleType || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">Start Date</label>
      <input
        type="text"
        readOnly
        value={formData.startDate || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">End Date</label>
      <input
        type="text"
        readOnly
        value={formData.endDate || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div>
      <label className="text-sm text-[#232323]">Route Type</label>
      <input
        type="text"
        readOnly
        value={formData.routeType || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

    <div className="col-span-2">
      <label className="text-sm text-[#232323]">Experience Description</label>
      <textarea
        readOnly
        rows={4}
        value={formData.description || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2] resize-none"
      ></textarea>
    </div>

    {/* ---------- Skills & Preferences ---------- */}
    <h3 className="col-span-2 text-lg font-semibold text-[#232323] mt-6 mb-2">
      Skills & Preferences
    </h3>

    <div className="col-span-2">
      <label className="text-sm text-[#232323]">Skills</label>
      <textarea
        readOnly
        rows={2}
        value={formData.skills?.join(", ") || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2] resize-none"
      ></textarea>
    </div>

    <div className="col-span-2">
      <label className="text-sm text-[#232323]">Additional Preferences</label>
      <input
        type="text"
        readOnly
        value={formData.preferences || ""}
        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
      />
    </div>

  </div>
)}




          </div>

          <div className=" bottom-0 pt-12 mt-4 left-56 right-0 bg-white flex justify-center gap-4 items-center py-4">
            <button
              type="button"
              onClick={() => {
                if (activeStep === 0 || activeStep === tabs.length - 1) {
                  setActiveStep(0);
                  setFormData({});
                } else {
                  prevStep();
                }
              }}
              className={`px-8 py-2 rounded-md text-sm font-[Inter] font-medium transition border-2 border-[#3565E3] text-[#3565E3] hover:bg-gray-50`}
            >
              {activeStep === 0 || activeStep === tabs.length - 1
                ? "Cancel"
                : "Back"}
            </button>

            {activeStep < tabs.length - 1 ? (
              <button
                type="button"
                onClick={(e) => nextStep(e)}
                className="px-10 py-2 rounded-md bg-[#3565E3] font-[Inter] border-2 border-[#3565E3] text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2 font-[Inter] bg-[#3565E3] border-2 border-[#3565E3] rounded-md text-white text-sm font-medium transition"
              >
                Continue
              </button>
            )}
          </div>

        </form>
      </div>
    </main>
  );
};

export default DriverResumeForm;
