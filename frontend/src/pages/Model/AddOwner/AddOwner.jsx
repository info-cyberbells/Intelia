import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { addSuperAdminOwner, updateSuperAdminOwner, getSingleOwner } from "../../../features/SuperAdminSlice/SuperAdminSlice";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";


const AddOwnerForm = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    correspondedMe: "",
    password: "",
    confirmPassword: "",
    profileImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: false
      }));
    }
  };


  useEffect(() => {
    if (isEditMode && id) {
      fetchOwnerData();
    }
  }, [id, isEditMode]);

  const fetchOwnerData = async () => {
    const result = await dispatch(getSingleOwner(id));

    if (result.meta.requestStatus === "fulfilled") {
      const owner = result.payload?.data || result.payload;

      setFormData({
        fullName: owner.fullName || "",
        email: owner.email || "",
        phone: owner.phoneNumber || "",
        companyName: owner.companyName || "",
        correspondedMe: owner.correspondedMe || "",
        password: "",
        confirmPassword: "",
        profileImage: owner.profileImage || null,
      });

      if (owner.profileImage) {
        setPreview(owner.profileImage);
      }
    } else {
      showToast(result.payload || "Failed to fetch owner data", "error");
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.companyName.trim()) errors.companyName = true;
    if (!formData.correspondedMe.trim()) errors.correspondedMe = true;

    if (!isEditMode) {
      if (!formData.password.trim()) errors.password = true;
      if (!formData.confirmPassword.trim()) errors.confirmPassword = true;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      setFieldErrors({
        password: true,
        confirmPassword: true,
      });
      showToast("Passwords do not match", "error");
      return;
    }

    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("email", formData.email);
    fd.append("phoneNumber", formData.phone);
    fd.append("companyName", formData.companyName);
    fd.append("correspondedMe", formData.correspondedMe);

    if (!isEditMode && formData.password) {
      fd.append("password", formData.password);
    }

    if (formData.profileImage && typeof formData.profileImage !== "string") {
      fd.append("profileImage", formData.profileImage);
    }

    let result;

    if (isEditMode) {
      result = await dispatch(updateSuperAdminOwner({ id, formData: fd }));
    } else {
      result = await dispatch(addSuperAdminOwner(fd));
    }

    if (result.meta.requestStatus === "fulfilled") {
      showToast(isEditMode ? "Owner updated successfully" : "Owner added successfully", "success");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        correspondedMe: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
      });

      setPreview(null);
      setFieldErrors({});
      navigate(-1);
    } else {
      showToast(result.payload || "Failed to save owner", "error");
    }
  };



  return (
    <div className="ml-56 mt-16 bg-[#F5F5F5] p-8">
      <h2 className="text-[#363B64] text-4xl font-bold mb-8">
        {isEditMode ? "Edit Owner" : "Add Owner"}
      </h2>
      <div className="w-full max-w-4xl px-8 py-8 bg-white shadow-sm rounded-xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          autoComplete="off"
        >
          <input type="text" name="fake_username" autoComplete="username" className="hidden" />
          <input type="password" name="fake_password" autoComplete="new-password" className="hidden" />
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Carter"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full border rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm ${fieldErrors.fullName ? "border-red-500 bg-red-50" : "border-gray-200"}`}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="owner@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm ${fieldErrors.email ? "border-red-500 bg-red-50" : "border-gray-200"}`}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+1 987 654 3210"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full border rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm ${fieldErrors.phone ? "border-red-500 bg-red-50" : "border-gray-200"}`} />
          </div>

          {/* company Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              placeholder="BlueLine Transport Pvt Ltd"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full border rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm ${fieldErrors.companyName ? "border-red-500 bg-red-50" : "border-gray-200"}`} />
          </div>

          {/* Corresponded Me */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#424242] font-medium">
              Corresponded Me:
            </label>
            <input
              type="text"
              name="correspondedMe"
              placeholder="California, USA"
              value={formData.correspondedMe}
              onChange={handleChange}
              className={`w-full border rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm ${fieldErrors.correspondedMe ? "border-red-500 bg-red-50" : "border-gray-200"}`} />
          </div>

          {/* Password */}
          {/* Password + Confirm Password (HIDE IN EDIT MODE) */}
          {!isEditMode && (
            <>
              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#424242] font-medium">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-3 py-2.5 pr-10 mt-1 text-sm outline-none focus:ring-1 text-[#718EBF]
            focus:ring-[#DFEAF2] ${fieldErrors.password ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPass ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#424242] font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-3 py-2.5 pr-10 mt-1 text-sm outline-none focus:ring-1 text-[#718EBF]
            focus:ring-[#DFEAF2] ${fieldErrors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPass ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}


          {/* Upload Photo */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-sm text-[#232323] font-medium">
              Upload Profile Image (Optional)
            </label>

            {/* Upload Zone */}
            <label
              htmlFor="profileImage"
              className={`mt-2 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition
      ${formData.profileImage
                  ? "border-[#A7C8E7] bg-[#F8FBFD]"
                  : "border-[#DFEAF2] hover:bg-[#F8FBFD]"
                }`}
            >
              {formData.profileImage ? (
                <div className="relative h-full w-full flex justify-center items-center">
                  <img
                    src={
                      typeof formData.profileImage === "string"
                        ? formData.profileImage
                        : URL.createObjectURL(formData.profileImage)
                    }
                    alt="Profie Preview"
                    className="h-full max-h-40 rounded-xl object-contain p-2"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({
                        ...prev,
                        profileImage: null,
                      }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md"
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

                  <p className="text-sm">Click to upload or drag & drop</p>
                  <p className="text-xs text-[#A8B1C5] mt-1">
                    PNG, JPG (max 5MB)
                  </p>
                </div>
              )}
            </label>

            {/* Hidden File Input */}
            <input
              id="profileImage"
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
                    profileImage: file,
                  }));
                }
              }}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-2 text-[#3565E3] border border-[#3565E3] rounded-xl "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-2 bg-[#3565E3] border-[#3565E3] text-white rounded-xl"
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOwnerForm;
