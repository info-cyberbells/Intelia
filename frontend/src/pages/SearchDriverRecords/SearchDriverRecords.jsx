import React from "react";
import { useNavigate } from "react-router-dom";

const SearchDriverRecords = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen ml-56 mt-12 font-[Poppins] bg-gray-50 flex flex-col">
      <div className="w-full max-w-3xl rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3565E3] mb-2">
          Search Driver Records
        </h2>
        <p className="text-gray-500 mb-8">
          Create your job ads by simply talking to Mia, your smart assistant.
        </p>

        {/* Form */}
        <form className="space-y-6" autoComplete="off">
          {/* Hidden fake fields to block browser autofill */}
          <input type="text" name="fakeuser" autoComplete="username" className="hidden" />
          <input type="password" name="fakepass" autoComplete="new-password" className="hidden" />
          {/* Name */}
          <div>
            <label className="block text-[#5E6366] text-xs font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="name"
              className="w-2/3 px-4 py-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#5E6366] text-xs font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="email"
              autoComplete="off"
              className="w-2/3 px-4 py-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[#5E6366] text-xs font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="phone number"
              className="w-2/3 px-4 py-3 rounded-md  shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Driving License Number */}
          <div>
            <label className="block text-[#5E6366] text-xs font-medium mb-2">
              Driving License Number
            </label>
            <input
              type="password"
              placeholder="driving license number"
              autoComplete="off"
              className="w-2/3 px-4 py-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/detail-page')}
              className="bg-[#3565E3] hover:bg-blue-700 text-white text-xs font-thin px-8 py-2 rounded-md shadow transition-all w-full sm:w-auto"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchDriverRecords;
