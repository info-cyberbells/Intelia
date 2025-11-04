import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, registerDriver, reset } from '../../features/userSlice';
import { useNavigate } from "react-router-dom";


const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: (
            <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div className={`toast ${type}`}>
            {icons[type]}
            <div className="toast-message">{message}</div>
            <svg
                className="toast-close"
                onClick={onClose}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
    );
};


const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',

        //owner only fields
        companyName: '',
        correspondedMe: '',

        // Driver-only fields
        licenseNumber: '',
        municipality: '',
        vehicleRegistration: '',
        validUntil: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [toast, setToast] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'role') {
            setFieldErrors({});
        } else if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: false
            });
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (fieldErrors.confirmPassword) {
            setFieldErrors({
                ...fieldErrors,
                confirmPassword: false
            });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            showToast("Registration successful!", 'success');
            setTimeout(() => {
                navigate('/');
                dispatch(reset());
            }, 1000);
        }
        if (isError) {
            const errorMessage = message.includes('"')
                ? "Please fill all required fields correctly"
                : message;
            showToast(errorMessage, 'error');
            dispatch(reset());
        }
    }, [isSuccess, isError, message, navigate, dispatch]);

    const validateForm = () => {
        const errors = {};

        if (!formData.role) {
            errors.role = true;
            setFieldErrors(errors);
            showToast("Please select your role", 'error');
            return false;
        }
        // Common validations
        if (!formData.firstName.trim()) {
            errors.firstName = true;
        }
        if (!formData.surname.trim()) {
            errors.surname = true;
        }
        if (!formData.email.trim()) {
            errors.email = true;
        } else {
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = true;
            }
        }
        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = true;
        }
        if (!formData.password) {
            errors.password = true;
        } else if (formData.password.length < 6) {
            errors.password = true;
        }
        if (formData.password !== confirmPassword) {
            errors.confirmPassword = true;
        }

        // Owner specific validations
        if (formData.role === 'Owner') {
            if (!formData.companyName.trim()) {
                errors.companyName = true;
            }
            if (!formData.correspondedMe.trim()) {
                errors.correspondedMe = true;
            }
        }

        // Driver specific validations
        if (formData.role === 'Driver') {
            if (!formData.licenseNumber.trim()) {
                errors.licenseNumber = true;
            }
            if (!formData.municipality.trim()) {
                errors.municipality = true;
            }
            if (!formData.vehicleRegistration.trim()) {
                errors.vehicleRegistration = true;
            }
            if (!formData.validUntil) {
                errors.validUntil = true;
            } else {
                // Check if date is in the future
                const selectedDate = new Date(formData.validUntil);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    errors.validUntil = true;
                }
            }
        }

        setFieldErrors(errors);

        // Count errors and show appropriate message
        const errorCount = Object.keys(errors).length;
        if (errorCount === 0) {
            return true;
        } else if (errorCount === 1) {
            // Show specific error for single field
            const errorField = Object.keys(errors)[0];
            const errorMessages = {
                role: "Please select your role",
                firstName: "First name is required",
                surname: "Surname is required",
                email: "Please enter a valid email address",
                phoneNumber: "Phone number is required",
                password: "Password must be at least 6 characters",
                confirmPassword: "Passwords do not match",
                companyName: "Company name is required",
                correspondedMe: "Please tell us what corresponded you",
                licenseNumber: "License number is required",
                municipality: "Municipality is required",
                vehicleRegistration: "Vehicle registration is required",
                validUntil: "Valid until date is required and must be in future"
            };
            showToast(errorMessages[errorField], 'error');
        } else {
            showToast("Please correct the highlighted fields", 'error');
        }

        return false;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        if (formData.role === 'Owner') {
            const ownerData = {
                firstName: formData.firstName,
                surname: formData.surname,
                companyName: formData.companyName,
                correspondedMe: formData.correspondedMe,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber
            };
            dispatch(register(ownerData));
        } else if (formData.role === 'Driver') {
            const driverData = {
                licenseNumber: formData.licenseNumber,
                firstName: formData.firstName,
                surname: formData.surname,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                municipality: formData.municipality,
                vehicleRegistration: formData.vehicleRegistration,
                validUntil: formData.validUntil
            };
            dispatch(registerDriver(driverData));
        }
    };

    return (
        <>
            {toast && (
                <div className="toast-container">
                    <Toast message={toast.message} type={toast.type} onClose={closeToast} />
                </div>
            )}
            <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
                 @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    @keyframes counterRotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(-360deg);
        }
    }
    
    .rotate-circle {
        animation: rotate 20s linear infinite;
    }
    
    .counter-rotate {
        animation: counterRotate 20s linear infinite;
    }
        `}</style>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden h-screen">
                {/* Background decorative circles */}
                <div className="absolute top-16 left-40 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
                <div className="absolute top-36 left-40 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
                {/* <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-50"></div>
            <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
            <div className="absolute top-10 right-40 w-20 h-20 bg-blue-100 rounded-full opacity-40"></div> */}

                <div className="absolute bottom-24 right-20 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
                <div className="absolute bottom-24 right-40 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>

                {/* Main container */}
                <div className="w-full max-w-6xl flex items-center justify-between gap-16 h-screen overflow-hidden">

                    {/* Left side - Phone mockup with concentric circles */}
                    <div className="hidden lg:flex flex-1 items-center justify-center relative pr-20 pl-20 sticky top-0 h-screen">
                        {/* Outer circle with location icons - Big Circle */}
                        <div className="absolute w-[550px] h-[550px] rotate-circle ">
                            <img
                                src="/ellipse.png"
                                alt="Big Circle"
                                className="w-full h-full object-contain"
                            />
                            {/* Location icons on big circle */}
                            <div className="absolute top-0 right-[60%]">
                                <div className="counter-rotate -translate-x-1/2 -translate-y-1/2">
                                    <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-[3px] border-white"></div>
                                </div>
                            </div>

                            <div className="absolute -bottom-1 left-1/2">
                                <div className="counter-rotate -translate-x-1/2 translate-y-1/2">
                                    <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-[3px] border-white"></div>
                                </div>
                            </div>

                            <div className="absolute -left-1 top-[40%]">
                                <div className="counter-rotate -translate-y-1/2 -translate-x-1/2">
                                    <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-[3px] border-white"></div>
                                </div>
                            </div>
                            {/* <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                            <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                        </div> */}

                            {/* <div className="absolute top-[1%] left-[15%]">
                            <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                        </div> */}

                            <div className="absolute top-[60%] right-[0%]">
                                <div className="counter-rotate">
                                    <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-[3px] border-white"></div>
                                </div>
                            </div>

                            <div className="absolute top-[10%] right-[15%]">
                                <div className="counter-rotate">
                                    <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-[3px] border-white"></div>
                                </div>
                            </div>

                            {/* <div className="absolute bottom-[15%] left-[15%]">
                            <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                        </div> */}
                        </div>

                        {/* Medium Circle */}
                        <div className="absolute w-[450px] h-[450px] rotate-circle">
                            <img
                                src="/ellipse.png"
                                alt="Medium Circle"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute top-[40%] right-[-1%]">
                                <div className="counter-rotate w-6 h-6">
                                    {/* Location image */}
                                    <img src="/Location_vector.png" alt="Location" className="w-full h-full" />
                                    {/* White ring with transparent center */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-[3px] border-white"></div>
                                </div>
                            </div>

                        </div>

                        {/* little small more than medium */}
                        <div className="absolute w-[350px] h-[350px] rotate-circle">
                            <img
                                src="/ellipse.png"
                                alt="Small Circle"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute bottom-[37%] left-[-2%]">
                                <div className="counter-rotate -translate-x-1/2 -translate-y-1/2">
                                    <img src="/Location_vector.png" alt="Location" className="w-6 h-6" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-[3px] border-white"></div>
                                </div>
                            </div>
                        </div>

                        {/* Small Circle */}
                        <div className="absolute w-[250px] h-[250px] rotate-circle">
                            <img
                                src="/ellipse.png"
                                alt="Small Circle"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* iPhone mockup */}
                        <div className="relative z-10 w-70 h-[460px] bg-black rounded-[3rem] shadow-2xl p-3 ">
                            {/* Dynamic Island */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-5  bg-black rounded-full z-20"></div>

                            {/* Screen */}
                            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                                {/* Add your mobile screen image here */}
                                <img
                                    src="/Login_image.png"
                                    alt="Mobile Screen"
                                    className="w-full h-full object-cover rounded-[2.5rem] "
                                />
                            </div>

                            {/* Home indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
                        </div>
                    </div>

                    {/* Right side - Main register form */}
                    <div className="flex-1 max-w-md w-full relative overflow-y-auto max-h-screen py-8 scrollbar-hide -top-4">
                        <div className="rounded-2xl p-10">
                            <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: "#424242" }}>Join us Now!!</h1>
                            <p className="mb-6 text-center" style={{ color: "#BDBDBD", fontWeight: "400" }}>Let's Create your Account</p>

                            <form className="space-y-6">
                                {/* Fake fields to prevent Chrome autofill */}
                                <input type="text" name="fakeusernameremembered" autoComplete="username" className="hidden" />
                                <input type="password" name="fakepasswordremembered" autoComplete="new-password" className="hidden" />

                                <div className="mb-6">
                                    <label
                                        className="block text-sm font-medium mb-1"
                                        style={{ color: "#424242", fontWeight: 600 }}
                                    >
                                        Select Your Role
                                    </label>

                                    <div className="relative">
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-10 border ${fieldErrors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none`}
                                        >
                                            <option value="" className='cursor-pointer'>Select your role</option>
                                            <option value="Owner">Owner</option>
                                            <option value="Driver">Driver</option>
                                        </select>

                                        <svg
                                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                        >
                                            <path
                                                d="M5 7.5L10 12.5L15 7.5"
                                                stroke="#6B7280"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Show fields only after role is selected */}
                                {formData.role && (
                                    <>
                                        {/* First Name - Common for both */}
                                        <div className="mb-6">
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                style={{ color: "#424242", fontWeight: 600 }}
                                            >
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="enter your name"
                                                className={`w-full px-4 py-3 border ${fieldErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                        </div>

                                        {/* Surname - Common for both */}
                                        <div className="mb-6">
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                style={{ color: "#424242", fontWeight: 600 }}
                                            >
                                                Surname
                                            </label>
                                            <input
                                                type="text"
                                                name="surname"
                                                value={formData.surname}
                                                onChange={handleChange}
                                                placeholder="enter your surname"
                                                className={`w-full px-4 py-3 border ${fieldErrors.surname ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`} />
                                        </div>

                                        {/* Owner Only - Company Name */}
                                        {formData.role === 'Owner' && (
                                            <>
                                                <div className="mb-6">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: "#424242", fontWeight: 600 }}
                                                    >
                                                        Company Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="companyName"
                                                        value={formData.companyName}
                                                        onChange={handleChange}
                                                        placeholder="enter your company name"
                                                        className={`w-full px-4 py-3 border ${fieldErrors.companyName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`} />
                                                </div>
                                                <div className="mb-6">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: "#424242", fontWeight: 600 }}
                                                    >
                                                        What Corresponded me
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="correspondedMe"
                                                        value={formData.correspondedMe}
                                                        onChange={handleChange}
                                                        placeholder="enter your reason"
                                                        className={`w-full px-4 py-3 border ${fieldErrors.correspondedMe ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>
                                            </>
                                        )}



                                        {formData.role === "Driver" && (
                                            <>
                                                <div className="mb-6">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: "#424242", fontWeight: 600 }}
                                                    >
                                                        License Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="licenseNumber"
                                                        value={formData.licenseNumber}
                                                        onChange={handleChange}
                                                        placeholder="enter your license number"
                                                        className={`w-full px-4 py-3 border ${fieldErrors.licenseNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>

                                                <div className="mb-6">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: "#424242", fontWeight: 600 }}
                                                    >
                                                        Municipality
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="municipality"
                                                        value={formData.municipality}
                                                        onChange={handleChange}
                                                        placeholder="enter municipality"
                                                        className={`w-full px-4 py-3 border ${fieldErrors.municipality ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>

                                                <div className="mb-6">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: "#424242", fontWeight: 600 }}
                                                    >
                                                        Vehicle Registration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="vehicleRegistration"
                                                        value={formData.vehicleRegistration}
                                                        onChange={handleChange}
                                                        placeholder="enter vehicle registration number"
                                                        className={`w-full px-4 py-3 border ${fieldErrors.vehicleRegistration ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>

                                                <div className="mb-6">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: "#424242", fontWeight: 600 }}
                                                    >
                                                        Valid Until
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="validUntil"
                                                        value={formData.validUntil}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 border ${fieldErrors.validUntil ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Email - Common for both */}
                                        <div className="mb-6">
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                style={{ color: "#424242", fontWeight: 600 }}
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="enter your email"
                                                autoComplete="new-email"
                                                className={`w-full px-4 py-3 border ${fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                        </div>

                                        {/* Phone Number - Common for both */}
                                        <div className="mb-6">
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                style={{ color: "#424242", fontWeight: 600 }}
                                            >
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                placeholder="enter your phone number"
                                                className={`w-full px-4 py-3 border ${fieldErrors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                        </div>

                                        {/* Password - Common for both */}
                                        <div className="mb-3">
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                style={{ color: "#424242" }}
                                            >Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    autoComplete="new-password"
                                                    placeholder="enter your password"
                                                    className={`w-full px-4 py-3 pr-12 border ${fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password - Common for both */}
                                        <div className="mb-6">
                                            <label
                                                className="block text-sm font-medium mb-1"
                                                style={{ color: "#424242" }}
                                            >
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={handleConfirmPasswordChange}
                                                    autoComplete="new-password"
                                                    placeholder="enter your password again"
                                                    className={`w-full px-4 py-3 pr-12 border ${fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </form>

                            {/* Sign in button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors  mb-2 mt-5"
                            >
                                {isLoading ? 'Signing up...' : 'Sign up'}
                            </button>

                            <div className="flex items-center justify-center mb-4 ">
                                <div className="w-12 h-px " style={{ backgroundColor: "#E0E0E0", fontWeight: 300 }}></div>
                                <span className="px-3 text-gray-500 font-medium" style={{ color: "#E0E0E0" }}>OR</span>
                                <div className="w-12 h-px" style={{ backgroundColor: "#E0E0E0", fontWeight: 300 }}></div>
                            </div>
                            {/* Google sign in */}
                            <button className="w-full border-2 border-gray-200 py-3 rounded-xl font-medium text-base flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>

                            {/* Sign up link */}
                            <p className="text-sm text-center text-gray-600 mt-6">
                                Already have an Account? <button className="text-blue-600 font-semibold hover:underline" onClick={() => (navigate("/"))}>Sign-in</button>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Scroll indicator - positioned on the right edge */}
                {formData.role && (
                    <div className="fixed right-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce">
                        <div className="w-px h-8 bg-gray-300"></div>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <div className="w-px h-8 bg-gray-300"></div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Register;