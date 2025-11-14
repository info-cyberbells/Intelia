import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addOwnerVehicle, fetchOwnerVehicles, updateOwnerVehicle } from "../../features/ownerSlice/ownerSlice";
import { useToast } from '../../context/ToastContext';

const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AddVehicleModal = ({ isOpen, onClose, editData }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        make: editData?.make || "",
        model: editData?.model || "",
        year: editData?.year || "",
        color: editData?.color || "",
        vin: editData?.vin || "",
        plateNo: editData?.plateNo || "",
        registrationState: editData?.registrationState || "",
        registrationExpiry: editData?.registrationExpiry ? formatDateForInput(editData.registrationExpiry) : "",
        capacity: editData?.capacity || "",
        fuelType: editData?.fuelType || "",
        transmission: editData?.transmission || "",
        lastInspection: editData?.lastInspection ? formatDateForInput(editData.lastInspection) : "",
        "insurance[provider]": editData?.insurance?.provider || "",
        "insurance[policyNo]": editData?.insurance?.policyNo || "",
        "insurance[expiryDate]": editData?.insurance?.expiryDate ? formatDateForInput(editData.insurance.expiryDate) : "",
        vehicleImage: editData?.vehicleImage || null
    });
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                make: editData?.make || "",
                model: editData?.model || "",
                year: editData?.year || "",
                color: editData?.color || "",
                vin: editData?.vin || "",
                plateNo: editData?.plateNo || "",
                registrationState: editData?.registrationState || "",
                registrationExpiry: editData?.registrationExpiry ? formatDateForInput(editData.registrationExpiry) : "",
                capacity: editData?.capacity || "",
                fuelType: editData?.fuelType || "",
                transmission: editData?.transmission || "",
                lastInspection: editData?.lastInspection ? formatDateForInput(editData.lastInspection) : "",
                "insurance[provider]": editData?.insurance?.provider || "",
                "insurance[policyNo]": editData?.insurance?.policyNo || "",
                "insurance[expiryDate]": editData?.insurance?.expiryDate ? formatDateForInput(editData.insurance.expiryDate) : "",
                vehicleImage: editData?.vehicleImage || null
            });
        }
    }, [editData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: false
            });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFieldErrors((prev) => ({ ...prev, carPicture: false }));
            setFormData(prev => ({
                ...prev,
                vehicleImage: file
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        // Required fields validation
        if (!formData.make.trim()) errors.make = true;
        if (!formData.model.trim()) errors.model = true;
        if (!formData.year) {
            errors.year = true;
        } else {
            const currentYear = new Date().getFullYear();
            const yearNum = parseInt(formData.year);
            if (yearNum < 1990 || yearNum > currentYear + 1) {
                errors.year = true;
            }
        }
        if (!formData.color.trim()) errors.color = true;
        if (!formData.vin.trim()) {
            errors.vin = true;
        } else if (formData.vin.length !== 17) {
            errors.vin = true;
        }


        if (!formData.plateNo.trim()) errors.plateNo = true;
        if (!formData.registrationState.trim()) errors.registrationState = true;
        if (!formData.registrationExpiry) errors.registrationExpiry = true;
        if (!formData.capacity) errors.capacity = true;
        if (!formData.fuelType) errors.fuelType = true;
        if (!formData.transmission) errors.transmission = true;
        if (!formData.lastInspection) errors.lastInspection = true;
        if (!formData["insurance[provider]"].trim()) errors.insuranceProvider = true;
        if (!formData["insurance[policyNo]"].trim()) errors.insurancePolicyNo = true;
        if (!formData["insurance[expiryDate]"]) errors.insuranceExpiryDate = true;
        if (!editData && !formData.vehicleImage) errors.carPicture = true;



        setFieldErrors(errors);

        const errorCount = Object.keys(errors).length;
        if (errorCount === 0) {
            return true;
        } else if (errorCount === 1) {
            const errorField = Object.keys(errors)[0];
            const errorMessages = {
                make: "Please enter vehicle make/brand",
                model: "Please enter vehicle model",
                year: "Please enter a valid year (1900-" + (new Date().getFullYear() + 1) + ")",
                color: "Please enter vehicle color",
                vin: "VIN must be exactly 17 characters",
                plateNo: "Please enter plate number",
                registrationState: "Please enter registration state",
                registrationExpiry: "Please select registration expiry date",
                capacity: "Please select vehicle capacity",
                fuelType: "Please select fuel type",
                transmission: "Please select transmission type",
                lastInspection: "Please select last inspection date",
                insuranceProvider: "Please enter insurance provider",
                insurancePolicyNo: "Please enter policy number",
                insuranceExpiryDate: "Please select insurance expiry date",
                carPicture: "Please upload a vehicle image",

            };
            showToast(errorMessages[errorField], 'error');
        } else {
            showToast("Please fill in all required fields correctly", 'error');
        }

        return false;
    };


    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const fd = new FormData();

        Object.keys(formData).forEach(key => {
            // Skip vehicleImage if it's a string (existing URL) or null
            if (key === 'vehicleImage') {
                // Only append if it's a new File object
                if (formData[key] && typeof formData[key] === 'object' && formData[key] instanceof File) {
                    fd.append(key, formData[key]);
                }
            } else {
                // Append all other fields
                fd.append(key, formData[key]);
            }
        });

        let res;

        if (editData?._id) {
            // DON'T append vehicleId to FormData - pass it separately in the service
            res = await dispatch(updateOwnerVehicle({ formData: fd, vehicleId: editData._id }));
        } else {
            res = await dispatch(addOwnerVehicle(fd));
        }

        if (res.meta.requestStatus === "fulfilled") {
            showToast(editData ? "Vehicle updated successfully!" : "Vehicle added successfully!", 'success');
            dispatch(fetchOwnerVehicles());
            onClose();
        } else {
            const errorMessage = res.payload?.message || (editData ? "Failed to update vehicle" : "Failed to add vehicle");
            showToast(errorMessage, 'error');
        }
    };

    const handleCancel = () => {
        setFormData({
            make: "",
            model: "",
            year: "",
            color: "",
            vin: "",
            plateNo: "",
            registrationState: "",
            registrationExpiry: "",
            capacity: "",
            fuelType: "",
            transmission: "",
            lastInspection: "",
            "insurance[provider]": "",
            "insurance[policyNo]": "",
            "insurance[expiryDate]": "",
            vehicleImage: null
        });
        setFieldErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 ">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-[#3565E3]">
                            {editData ? "Edit Vehicle" : "Add Vehicle"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {editData ? "Update vehicle information below." : "Add the vehicles here manually."}
                        </p>
                    </div>

                    {/* Close (X) Button */}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>


                {/* Modal Body */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="make"
                                value={formData.make}
                                onChange={handleInputChange}
                                placeholder="e.g. Honda, Maruti Suzuki"
                                className={`w-full px-4 py-2.5 border ${fieldErrors.make ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm`} />
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model
                            </label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                placeholder="e.g. Amaze VX 1.2 Petrol MT"
                                className={`w-full px-4 py-2.5 border ${fieldErrors.model ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm`} />
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year
                            </label>
                            <div className="relative">
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.year ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm ${formData.year ? 'text-gray-700' : 'text-gray-400'} appearance-none`}
                                >
                                    <option value="">Select Year</option>

                                    {Array.from(
                                        { length: new Date().getFullYear() - 1990 + 1 },
                                        (_, i) => new Date().getFullYear() - i
                                    ).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <svg
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Grey"
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.color ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm pr-10`} />
                            </div>
                        </div>

                        {/* Registration State */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Registration State
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="registrationState"
                                    value={formData.registrationState}
                                    onChange={handleInputChange}
                                    placeholder="e.g. CHD"
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.registrationState ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm pr-10`} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Registration Expiry
                            </label>
                            <input
                                type="date"
                                name="registrationExpiry"
                                value={formData.registrationExpiry}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border ${fieldErrors.registrationExpiry ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm text-gray-700`}
                            />
                        </div>

                        {/* VIN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                VIN
                                <span className="text-gray-400 text-xs ml-1">(17 characters)</span>
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="vin"
                                    value={formData.vin}
                                    onChange={handleInputChange}
                                    maxLength={17}
                                    placeholder="e.g. 4T1BF1FK7HU000007"
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.vin ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm`}
                                />

                                {/* Character Count */}
                                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                    {formData.vin.length}/17
                                </span>

                                {/* Tick or Cross */}
                                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {formData.vin.length === 17 ? (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </div>


                        {/* Plate No. */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plate No.
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="plateNo"
                                    value={formData.plateNo}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 8ABC003"
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.plateNo ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm pr-10`} />
                            </div>
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Capacity
                            </label>
                            <div className="relative">
                                <select
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}

                                    className={`w-full px-4 py-2.5 border ${fieldErrors.capacity ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm ${formData.capacity ? 'text-gray-700' : 'text-gray-400'} appearance-none`}                                >
                                    <option value="">Select capacity</option>
                                    <option value="2">2 Passengers</option>
                                    <option value="4">4 Passengers</option>
                                    <option value="5">5 Passengers</option>
                                    <option value="7">7 Passengers</option>
                                    <option value="8">8 Passengers</option>
                                </select>
                                <svg
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Fuel Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fuel Type
                            </label>
                            <div className="relative">
                                <select
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.fuelType ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm ${formData.fuelType ? 'text-gray-700' : 'text-gray-400'} appearance-none`}                                >
                                    <option value="">Select fuel type</option>
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                                <svg
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Transmission */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transmission
                            </label>
                            <div className="relative">
                                <select
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.transmission ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm ${formData.transmission ? 'text-gray-700' : 'text-gray-400'} appearance-none`}                                >
                                    <option value="">Select transmission</option>
                                    <option value="manual">Manual</option>
                                    <option value="automatic">Automatic</option>
                                </select>
                                <svg
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Last Inspection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Inspection
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="lastInspection"
                                    value={formData.lastInspection}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.lastInspection ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm text-gray-700`}
                                />


                            </div>
                        </div>

                        {/* Insurance Provider */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Insurance Provider
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="insurance[provider]"
                                    placeholder="Enter insurance provider"
                                    value={formData["insurance[provider]"]}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.insuranceProvider ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm text-gray-700`}
                                />

                            </div>
                        </div>

                        {/* Insurance Policy Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Insurance Policy Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="insurance[policyNo]"
                                    placeholder="Enter Policy Number"
                                    value={formData["insurance[policyNo]"]}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 border ${fieldErrors.insurancePolicyNo ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm text-gray-700`} />

                            </div>
                        </div>

                        {/* Insurance Expiry Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Insurance Expiry Date
                            </label>
                            <input
                                type="date"
                                name="insurance[expiryDate]"
                                value={formData["insurance[expiryDate]"]}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border ${fieldErrors.insuranceExpiryDate ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3565E3] focus:border-transparent text-sm text-gray-700`}
                            />
                        </div>



                        {/* Upload Car Picture */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Car Picture <span className="text-red-500">*</span>
                            </label>

                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
        ${fieldErrors?.carPicture ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-[#3565E3]"}`}
                            >
                                <input
                                    type="file"
                                    id="carPicture"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFieldErrors((prev) => ({ ...prev, carPicture: false }));
                                            setFormData((prev) => ({ ...prev, vehicleImage: file }));
                                        }
                                    }}
                                />

                                <label htmlFor="carPicture" className="cursor-pointer block">
                                    {/* Show preview if new file uploaded OR existing image */}
                                    {formData.vehicleImage ? (
                                        <div className="relative inline-block mx-auto">
                                            <img
                                                src={
                                                    typeof formData.vehicleImage === 'string'
                                                        ? formData.vehicleImage  // Existing image URL
                                                        : URL.createObjectURL(formData.vehicleImage)  // New file
                                                }
                                                alt="preview"
                                                className="mx-auto h-32 rounded-lg object-cover shadow-md"
                                            />

                                            {/* Remove (Cut) Icon */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFormData((prev) => ({ ...prev, vehicleImage: null }));
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                                            >
                                                ✕
                                            </button>

                                            {/* Change photo text */}
                                            <p className="mt-2 text-xs text-gray-500">
                                                {typeof formData.vehicleImage === 'string' ? 'Click to change photo' : formData.vehicleImage.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <p className="mt-2 text-sm text-[#3565E3]">Upload Photo</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="px-8 py-2.5 border border-[#3565E3] text-[#3565E3] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 bg-[#3565E3] text-white rounded-lg hover:bg-[#2851c7] transition-colors font-medium"
                    >
                        {editData ? "Update" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVehicleModal;