import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from '../../context/ToastContext';
import { fetchMyResume, postDriverResume } from "../../features/Drivers/driverSlice";
import { fetchRouteTypes, fetchVehicleTypes, fetchSkills } from "../../features/masterData/masterDataSlice";

const DriverResumeForm = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { resume, loading } = useSelector((state) => state.drivers);
  const { routeTypes, vehicleTypes, skills } = useSelector((state) => state.masterData);

  const tabs = [
    "Basic Info",
    "Experience",
    "Skills & Preferences",
    "AI Resume Preview",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    municipality: "",
    dob: "",
    licenseNumber: "",
    expiry: "",
    companyName: "",
    startDate: "",
    endDate: "",
    vehicleType: [],
    routeType: [],
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

  useEffect(() => {
    dispatch(fetchMyResume());
    dispatch(fetchRouteTypes());
    dispatch(fetchVehicleTypes());
    dispatch(fetchSkills());

  }, []);

  useEffect(() => {
    if (resume) {
      setFormData({
        fullName: resume.basicInfo?.fullName || "",
        email: resume.basicInfo?.email || "",
        municipality: resume.basicInfo?.municipality || "",
        dob: resume.basicInfo?.dob?.slice(0, 10) || "",
        licenseNumber: resume.basicInfo?.licenseNumber || "",
        expiry: resume.basicInfo?.licenseExpiry?.slice(0, 10) || "",
        companyName: resume.experience?.companyName || "",
        startDate: resume.experience?.startDate?.slice(0, 10) || "",
        endDate: resume.experience?.endDate?.slice(0, 10) || "",
        vehicleType: resume.experience?.vehicleType || [],
        routeType: resume.experience?.routeType || [],
        description: resume.experience?.description || "",
        skills: resume.skillPreferences?.skills || [],
        preferences: resume.skillPreferences?.additionalPreferences || "",
        licensePhoto: resume.basicInfo?.licensePhoto || null,
      });
    }
  }, [resume]);


  const nextStep = (e) => {
    e?.preventDefault();
    if (activeStep < tabs.length - 1) {
      setTimeout(() => setActiveStep((prev) => prev + 1), 0);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Helper function for adding text with word wrap
    const addText = (text, x, yPos, maxWidth, fontSize = 11, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, yPos);
      return lines.length * (fontSize * 0.5); // Return height used
    };

    // Header - Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(35, 35, 35);
    doc.text(formData.fullName || "Driver", marginLeft, y);
    y += 8;

    // Subtitle - Vehicle Types
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(113, 142, 191);
    const vehicleTypeText = Array.isArray(formData.vehicleType)
      ? formData.vehicleType.join(", ") + " Driver"
      : (formData.vehicleType || "") + " Driver";
    doc.text(vehicleTypeText, marginLeft, y);
    y += 12;

    // Two columns layout
    const leftX = marginLeft;
    const rightX = pageWidth / 2 + 10;
    const columnWidth = (pageWidth / 2) - 30;

    // ============ BASIC INFO (Left Column) ============
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(53, 101, 227);
    doc.text("Basic Info", leftX, y);

    let leftY = y + 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    if (formData.email) {
      doc.setFont("helvetica", "bold");
      doc.text("Email: ", leftX, leftY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      doc.text(formData.email, leftX + 20, leftY);
      leftY += 6;
    }

    if (formData.municipality) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Municipality: ", leftX, leftY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      doc.text(formData.municipality, leftX + 30, leftY);
      leftY += 6;
    }

    if (formData.dob) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("DOB: ", leftX, leftY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      doc.text(formData.dob, leftX + 20, leftY);
      leftY += 6;
    }

    if (formData.licenseNumber) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("License: ", leftX, leftY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      doc.text(formData.licenseNumber, leftX + 20, leftY);
      leftY += 6;
    }

    if (formData.expiry) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("License Expiry: ", leftX, leftY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      doc.text(formData.expiry, leftX + 33, leftY);
      leftY += 6;
    }

    // ============ EXPERIENCE (Right Column) ============
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(53, 101, 227);
    doc.text("Experience", rightX, y);

    let rightY = y + 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    if (formData.companyName) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Company: ", rightX, rightY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      doc.text(formData.companyName, rightX + 25, rightY);
      rightY += 6;
    }

    if (formData.vehicleType?.length > 0) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Vehicle Type: ", rightX, rightY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      const vehicleText = Array.isArray(formData.vehicleType)
        ? formData.vehicleType.join(", ")
        : formData.vehicleType;
      const vehicleLines = doc.splitTextToSize(vehicleText, columnWidth - 35);
      doc.text(vehicleLines, rightX + 30, rightY);
      rightY += vehicleLines.length * 6;
    }

    if (formData.routeType?.length > 0) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Route Type: ", rightX, rightY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      const routeText = Array.isArray(formData.routeType)
        ? formData.routeType.join(", ")
        : formData.routeType;
      const routeLines = doc.splitTextToSize(routeText, columnWidth - 35);
      doc.text(routeLines, rightX + 28, rightY);
      rightY += routeLines.length * 6;
    }

    if (formData.startDate || formData.endDate) {
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Duration: ", rightX, rightY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(115, 128, 141);
      doc.text(`${formData.startDate || ""} - ${formData.endDate || ""}`, rightX + 23, rightY);
      rightY += 6;
    }

    // Move Y below both columns
    y = Math.max(leftY, rightY) + 8;

    // ============ DESCRIPTION ============
    if (formData.description) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(53, 101, 227);
      doc.text("Description", marginLeft, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(115, 128, 141);
      const descLines = doc.splitTextToSize(formData.description, pageWidth - 40);
      doc.text(descLines, marginLeft, y);
      y += descLines.length * 5 + 8;
    }

    // ============ SKILLS ============
    if (formData.skills?.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(53, 101, 227);
      doc.text("Skills", marginLeft, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(115, 128, 141);
      const skillsText = Array.isArray(formData.skills)
        ? formData.skills.join(", ")
        : formData.skills;
      const skillLines = doc.splitTextToSize(skillsText, pageWidth - 40);
      doc.text(skillLines, marginLeft, y);
      y += skillLines.length * 5 + 8;
    }

    // ============ PREFERENCES ============
    if (formData.preferences) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(53, 101, 227);
      doc.text("Preferences", marginLeft, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(115, 128, 141);
      const prefLines = doc.splitTextToSize(formData.preferences, pageWidth - 40);
      doc.text(prefLines, marginLeft, y);
      y += prefLines.length * 5;
    }

    // Save PDF
    doc.save(`${formData.fullName || "Driver"}_Resume.pdf`);
  };


  const handleSubmit = async (e) => {
    e?.preventDefault();

    try {
      // Create FormData directly here
      const formDataToSend = new FormData();

      // Append basic info - MATCH POSTMAN FIELD NAMES EXACTLY
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("municipality", formData.municipality);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("licenseNumber", formData.licenseNumber);
      formDataToSend.append("licenseExpiry", formData.expiry);

      // Append experience - MATCH POSTMAN FIELD NAMES
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("description", formData.description);

      // Append routeType as comma-separated string (like in Postman)
      formDataToSend.append("routeType", formData.routeType.join(", "));

      // Append vehicleType as comma-separated string (like in Postman)
      formDataToSend.append("vehicleType", formData.vehicleType.join(", "));

      // Append skills as comma-separated string (like in Postman)
      formDataToSend.append("skills", formData.skills.join(", "));

      // Append additionalPreferences (note the field name!)
      formDataToSend.append("additionalPreferences", formData.preferences);

      // Append license photo if exists
      if (formData.licensePhoto) {
        formDataToSend.append("licensePhoto", formData.licensePhoto);
      }

      console.log("Sending FormData");

      // Debug: Log all FormData entries
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      await dispatch(postDriverResume(formDataToSend)).unwrap();
      showToast("Resume submitted successfully!", "success");
    } catch (error) {
      console.error("Failed to submit resume:", error);
      showToast(error || "Failed to submit resume. Please try again.", "error");
    }
  };

  return (
    <main className="ml-56 mt-16 min-h-screen bg-[#F5F5F5] p-8 font-inter flex flex-col justify-between">
      <div className="p-8 rounded-2xl max-w-5xl bg-white border border-[#DDE2E5]">
        <form
          onSubmit={handleSubmit}
          className=" min-h-[70vh] pb-4 flex flex-col justify-between"
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
                    className={`pb-2 font-[Inter] transition-colors ${activeStep === index
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
                  <label className="text-sm text-[#232323]">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
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
                    placeholder="10/30"
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
                        ${formData.licensePhoto
                        ? "border-[#A7C8E7] bg-[#F8FBFD]"
                        : "border-[#DFEAF2] hover:bg-[#F8FBFD]"
                      }`}
                  >
                    {formData.licensePhoto ? (
                      <div className="relative">
                        <img
                          src={
                            typeof formData.licensePhoto === 'string'
                              ? formData.licensePhoto
                              : URL.createObjectURL(formData.licensePhoto)
                          }
                          alt="License"
                          className="h-40 rounded-xl object-contain border border-[#DFEAF2] shadow-sm mt-2"
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
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Earth Movers"
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
                    placeholder="01/01/2012"
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
                    placeholder="01/01/2020"
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm  focus:outline-none focus:border-[#DFEAF2]"
                  />
                </div>

                <div className="relative">
                  <label className="text-sm text-[#232323]">Vehicle Type</label>

                  <div
                    onClick={() => setIsVehicleDropdownOpen((prev) => !prev)}
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm bg-white cursor-pointer flex justify-between items-center focus:outline-none"
                  >
                    <span>
                      {formData.vehicleType && formData.vehicleType.length > 0
                        ? `${formData.vehicleType.length} Vehicle Types Selected`
                        : "Select Vehicle Type..."}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#718EBF"
                      className={`w-5 h-5 transform transition-transform duration-200 ${isVehicleDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {isVehicleDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-[#DFEAF2] rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {vehicleTypes && vehicleTypes.length > 0 ? (
                        vehicleTypes.map((item) => (
                          <label
                            key={item._id}
                            className="flex items-center px-4 py-2 text-sm text-[#718EBF] cursor-pointer hover:bg-[#F8FBFD]"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <input
                              type="checkbox"
                              checked={formData.vehicleType.includes(item.name)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setFormData((prev) => ({
                                  ...prev,
                                  vehicleType: isChecked
                                    ? [...prev.vehicleType, item.name]
                                    : prev.vehicleType.filter((v) => v !== item.name),
                                }));
                              }}
                              className="mr-2 accent-[#3565E3]"
                            />
                            {item.name}
                          </label>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-sm text-gray-400">No vehicle types available</p>
                      )}
                    </div>
                  )}

                  {formData.vehicleType?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.vehicleType.map((vehicle) => (
                        <span
                          key={vehicle}
                          className="px-3 py-1 bg-[#E6EEFF] text-[#3565E3] text-xs font-medium rounded-full flex items-center gap-2"
                        >
                          {vehicle}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                vehicleType: prev.vehicleType.filter((v) => v !== vehicle),
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


                <div className="relative">
                  <label className="text-sm text-[#232323]">Route Type</label>

                  <div
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm bg-white cursor-pointer flex justify-between items-center focus:outline-none"
                  >
                    <span>
                      {formData.routeType && formData.routeType.length > 0
                        ? `${formData.routeType.length} Route Types Selected`
                        : "Select Route Type..."}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#718EBF"
                      className={`w-5 h-5 transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-[#DFEAF2] rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {routeTypes && routeTypes.length > 0 ? (
                        routeTypes.map((route) => (
                          <label
                            key={route._id}
                            className="flex items-center px-4 py-2 text-sm text-[#718EBF] cursor-pointer hover:bg-[#F8FBFD]"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <input
                              type="checkbox"
                              checked={formData.routeType.includes(route.name)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setFormData((prev) => ({
                                  ...prev,
                                  routeType: isChecked
                                    ? [...prev.routeType, route.name]
                                    : prev.routeType.filter((r) => r !== route.name),
                                }));
                              }}
                              className="mr-2 accent-[#3565E3]"
                            />
                            {route.name}
                          </label>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-sm text-gray-400">No route types available</p>
                      )}
                    </div>
                  )}

                  {formData.routeType?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.routeType.map((route) => (
                        <span
                          key={route}
                          className="px-3 py-1 bg-[#E6EEFF] text-[#3565E3] text-xs font-medium rounded-full flex items-center gap-2"
                        >
                          {route}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                routeType: prev.routeType.filter((r) => r !== route),
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

                <div className="relative">
                  <label className="text-sm text-[#232323]">Skills</label>

                  {/* Dropdown trigger */}
                  <div
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm bg-white cursor-pointer flex justify-between items-center focus:outline-none"
                  >
                    <span>
                      {formData.skills && formData.skills.length > 0
                        ? `${formData.skills.length} Skills Selected`
                        : "Select skills..."}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#718EBF"
                      className={`w-5 h-5 transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"
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
                      {skills && skills.length > 0 ? (
                        skills.map((item) => (
                          <label
                            key={item._id}
                            className="flex items-center px-4 py-2 text-sm text-[#718EBF] cursor-pointer hover:bg-[#F8FBFD]"
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                          >
                            <input
                              type="checkbox"
                              checked={formData.skills.includes(item.name)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setFormData((prev) => ({
                                  ...prev,
                                  skills: isChecked
                                    ? [...prev.skills, item.name]
                                    : prev.skills.filter((s) => s !== item.name),
                                }));
                              }}
                              className="mr-2 accent-[#3565E3]"
                            />
                            {item.name}
                          </label>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-sm text-gray-400">No skills available</p>
                      )}
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
              <div className="">
                {!showResume ? (
                  <div className="grid grid-cols-2 gap-6 font-[Inter]">
                    {/* ---------- Basic Info ---------- */}
                    <h3 className="col-span-2 text-lg font-semibold text-[##232323] mb-2">
                      Basic Info
                    </h3>

                    <div>
                      <label className="text-sm text-[#232323]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.fullName || ""}
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
                      <label className="text-sm text-[#232323]">
                        Municipality
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.municipality || ""}
                        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#232323]">
                        Date of Birth
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.dob || ""}
                        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#232323]">
                        License Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.licenseNumber || ""}
                        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#232323]">
                        License Expiry Date
                      </label>
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
                        <label className="text-sm text-[#232323]">
                          Uploaded License Photo
                        </label>
                        <img
                          src={
                            typeof formData.licensePhoto === 'string'
                              ? formData.licensePhoto
                              : URL.createObjectURL(formData.licensePhoto)
                          }
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
                      <label className="text-sm text-[#232323]">
                        Company Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.companyName || ""}
                        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#232323]">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.vehicleType || ""}
                        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#232323]">
                        Start Date
                      </label>
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
                      <label className="text-sm text-[#232323]">
                        Route Type
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.routeType || ""}
                        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm text-[#232323]">
                        Description
                      </label>
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
                      <label className="text-sm text-[#232323]">
                        Additional Preferences
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.preferences || ""}
                        className="mt-1 w-full text-[#718EBF] rounded-xl border border-[#DFEAF2] px-4 py-2 text-sm focus:outline-none focus:border-[#DFEAF2]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <h2 className="text-2xl font-semibold text-[#232323] mb-2">
                      {formData.fullName}
                    </h2>
                    <p className="text-sm text-[#718EBF] mb-6">
                      {formData.vehicleType?.join(", ")} Driver
                    </p>

                    <div className="grid grid-cols-2 text-left text-[#73808D] gap-6">
                      <div>
                        <h3 className="font-semibold mb-1 text-[#232323]">
                          Basic Info
                        </h3>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        <p><span className="font-medium">Municipality:</span> {formData.municipality}</p>
                        <p><span className="font-medium">DOB:</span> {formData.dob}</p>
                        <p><span className="font-medium">License:</span> {formData.licenseNumber}</p>
                        <p><span className="font-medium">License Expiry:</span> {formData.expiry}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-[#232323]">
                          Experience
                        </h3>
                        <p><span className="font-medium">Company:</span> {formData.companyName}</p>
                        <p><span className="font-medium">Vehicle Type:</span> {formData.vehicleType?.join(", ")}</p>
                        <p><span className="font-medium">Route Type:</span> {formData.routeType?.join(", ")}</p>
                        <p>
                          <span className="font-medium">Duration:</span> {formData.startDate} - {formData.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 text-[#73808D] text-left">
                      <h3 className="font-semibold mb-1 text-[#232323]">Description</h3>
                      <p className="mb-4">{formData.description}</p>

                      <h3 className="font-semibold mb-1 text-[#232323]">Skills</h3>
                      <p className="mb-3">{formData.skills?.join(", ")}</p>

                      <h3 className="font-semibold mb-1 text-[#232323]">Preferences</h3>
                      <p className="text-sm">{formData.preferences}</p>
                    </div>

                    {formData.licensePhoto && (
                      <div className="mt-6 text-left">
                        <h3 className="font-semibold mb-2 text-[#232323]">
                          License Photo
                        </h3>
                        <img
                          src={
                            typeof formData.licensePhoto === 'string'
                              ? formData.licensePhoto
                              : URL.createObjectURL(formData.licensePhoto)
                          }
                          alt="License"
                          className="h-48 rounded-xl border border-[#DFEAF2] object-contain shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>


          {/* ---------- BUTTONS ---------- */}
          <div className="bottom-0 pt-12 mt-4 bg-white flex justify-center gap-4 items-center py-4">
            {activeStep === tabs.length - 1 ? (
              !showResume ? (
                <>
                  <button
                    type="button"
                    onClick={() => prevStep()}
                    className="px-8 py-2 rounded-md border-2 border-[#3565E3] text-[#3565E3] text-sm font-normal hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"

                    onClick={() => setShowResume(true)}
                    className="px-8 py-2 rounded-md bg-[#3565E3] text-white border-2 border-[#3565E3] text-sm font-normal hover:bg-blue-700 transition"
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowResume(false)}
                    className="px-8 py-2 rounded-md border-2 border-[#3565E3] text-[#3565E3] text-sm font-normal hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleSubmit();
                      handleDownloadPDF();
                    }}
                    className="px-8 py-2 rounded-md bg-[#3565E3] text-white border-2 border-[#3565E3] text-sm font-normal hover:bg-blue-700 transition"
                  >
                    Download PDF
                  </button>
                </>
              )
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => prevStep()}
                  className="px-8 py-2 rounded-md border-2 border-[#3565E3] text-[#3565E3] text-sm font-normal hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={(e) => nextStep(e)}
                  className="px-8 py-2 rounded-md bg-[#3565E3] text-white border-2 border-[#3565E3] text-sm font-normal hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default DriverResumeForm;
