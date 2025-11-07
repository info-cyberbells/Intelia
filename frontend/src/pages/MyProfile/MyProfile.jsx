import React, { useState } from "react";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // 🧠 Profile form state (all empty)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    municipality: "",
    license: "",
    city: "",
    validUntil: "",
    country: "",
  });

  // 🖼️ Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Security form state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Handle profile input
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle security input
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save handler
  const handleSave = () => {
    // console.log("Profile Data:", formData);
    console.log("Profile Data:");
    console.log("Profile Image:", profileImage);
    setFormData((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, ""]))
    );
    setProfileImage(null);
    setImagePreview(null);
  };

  //security handler
  const handlePassChange = () => {
    // console.log("Security Data", securityData);
    setSecurityData((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, ""]))
    );
  };

  return (
    <div className="bg-[#F5F5F5] ml-56  p-6 min-h-screen  mx-auto mt-16 font-[Inter]">
      {/* === One Wrapper Div for Tabs + Content === */}
      <div className="w-full bg-white max-w-4xl rounded-2xl shadow-sm p-6">
        {/* --- Section 1: Tabs --- */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-2 px-4 text-sm font-medium transition ${activeTab === "profile"
              ? "text-[#3565E3] border-b-2 border-blue-600"
              : "text-[#718EBF]"
              }`}
          >
            Edit Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-2 px-4 text-sm font-medium transition ${activeTab === "security"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-[#718EBF]"
              }`}
          >
            Security
          </button>
        </div>

        {/*Section 2:*/}
        <div>
          {activeTab === "profile" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="grid grid-cols-[160px_1fr] gap-8 items-start"
              autoComplete="off"
            >
              <input type="text" name="fakeuser" autoComplete="username" className="hidden" />
              <input type="password" name="fakepass" autoComplete="new-password" className="hidden" />


              {/* 🖼️ Image Upload Section */}
              <div className="flex flex-col items-center w-40">
                <div className="relative">
                  <img
                    src={
                      imagePreview ||
                      //   "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      "https://randomuser.me/api/portraits/women/44.jpg"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-2 rounded-full shadow-md text-xs"
                  >
                    ✎
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">Change Photo</p>
              </div>

              {/* Form Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                  <label className="text-sm">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleProfileChange}
                    placeholder="Charlene"
                    className="w-full border text-[#718EBF] border-gray-200 rounded-xl px-3 py-2.5 mt-1 text-sm focus:ring-1 focus:ring-[#DFEAF2] outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleProfileChange}
                    placeholder="Charlene Reed"
                    className="w-full border rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] border-gray-200 outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    autoComplete="off"
                    placeholder="charlenareed876@gmail.com"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    autoComplete="off"
                    onChange={handleProfileChange}
                    placeholder="************"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleProfileChange}
                    className={`w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm ${!formData.dob ? "text-gray-400" : "text-black"
                      }`}
                    placeholder="Select Date"
                  />
                </div>

                <div>
                  <label className="text-sm">Municipality</label>
                  <input
                    type="text"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleProfileChange}
                    placeholder="San Jose, California, USA"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Driving License Number</label>
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleProfileChange}
                    placeholder="12ABC3400"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleProfileChange}
                    placeholder="San Jose"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Valid Until</label>
                  <input
                    type="text"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleProfileChange}
                    placeholder="6564"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleProfileChange}
                    placeholder="USA"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6 md:col-span-2">
                  <button
                    type="submit"
                    className="bg-[#3565E3] text-white text-xs rounded-xl px-16 py-2.5 hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // Security Tab
            <div className="max-w-md">
              <h4 className="font-semibold text-gray-700 mb-4">
                Change Password
              </h4>
              <div className="space-y-4">
                <div>
                  <label className=" text-sm">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={securityData.currentPassword}
                     autoComplete="new-password" 
                    onChange={handleSecurityChange}
                    className="w-full border text-[#718EBF] border-gray-200 rounded-xl px-3 py-2.5 mt-1 text-sm focus:ring-1 focus:ring-[#DFEAF2] outline-none"
                  />
                </div>

                <div>
                  <label className=" text-sm">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    className="w-full border text-[#718EBF] border-gray-200 rounded-xl px-3 py-2.5 mt-1 text-sm focus:ring-1 focus:ring-[#DFEAF2] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-12">
                <button
                  onClick={handlePassChange}
                  className="bg-[#3565E3] text-white text-xs rounded-xl px-16 py-2.5 hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
