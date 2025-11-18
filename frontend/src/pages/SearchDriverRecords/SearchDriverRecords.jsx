import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchDriverByLicense } from "../../features/ownerSlice/ownerSlice";
import { useToast } from '../../context/ToastContext';



const SearchDriverRecords = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [license, setLicense] = useState("");
  const dispatch = useDispatch();
  const { searchResult } = useSelector((state) => state.owner);
  const [inputError, setInputError] = useState(false);



  const handleSearch = async (e) => {
    e.preventDefault();

    if (!license.trim()) {
      setInputError(true);
      showToast("Please enter a license number", "error");
      return;
    }
    setInputError(false);
    const res = await dispatch(searchDriverByLicense(license));

    if (res.meta.requestStatus === "fulfilled") {
      showToast("Driver found!", "success");

      navigate("/detail-page", { state: { driver: res.payload.drivers[0] } });
    }
    else {
      showToast(res.payload || "No driver found", "error");
      setInputError(true);
    }
  };



  return (
    <div className="min-h-screen lg:ml-56 mt-12 font-[Poppins] bg-gray-50 flex flex-col">
      <div className="w-full max-w-3xl rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3565E3] mb-2">
          Search Driver Records
        </h2>
        <p className="text-gray-500 text-sm md:text-base mb-8">
          Create your job ads by simply talking to Mia, your smart assistant.
        </p>

        {/* Form */}
        <form className="space-y-6" autoComplete="off">

          <div>
            <label className="block text-[#5E6366] text-xs font-medium mb-2">
              Driving License Number
            </label>
            <input
              type="text"
              placeholder="Enter License Number"
              value={license}
              onChange={(e) => {
                setLicense(e.target.value);
                if (e.target.value.trim()) setInputError(false);
              }}
              className={`w-2/3 px-4 py-3 rounded-md shadow-sm outline-none transition-all
  ${inputError ? "border border-red-500 focus:ring-red-500" : "border border-gray-300 focus:ring-blue-500"}
`}
            />
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              onClick={handleSearch}
              className="bg-[#3565E3] hover:bg-blue-700 text-white text-xs font-thin px-8 py-2 rounded-md shadow transition-all sm:w-auto"
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
