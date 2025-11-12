import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, registerDriver, reset } from '../../features/userSlice/userSlice';
import { useNavigate } from "react-router-dom";
import { useToast } from '../../context/ToastContext';
import image from '../../assets/border.png';
import border from '../../assets/faceimage.png';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: '',
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
        validUntil: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [driverStep, setDriverStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [previousRole, setPreviousRole] = useState('');
    const [showUploadArea, setShowUploadArea] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role' && previousRole && previousRole !== value) {
            const confirmed = window.confirm(
                "Are you sure you want to change your role? All entered data will be lost."
            );

            if (confirmed) {
                setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    role: value,
                    companyName: '',
                    correspondedMe: '',
                    licenseNumber: '',
                    municipality: '',
                    validUntil: '',
                });
                setConfirmPassword('');
                setFieldErrors({});
                setDriverStep(1);
                setSelectedImage(null);
                setImagePreview(null);
                setPreviousRole(value);
                showToast("Role changed. Please fill in the details again.", 'info');
            }
            return;
        }

        // Normal field update
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'role' && !previousRole) {
            setPreviousRole(value);
        }

        if (name === 'role') {
            setFieldErrors({});
        } else if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: false
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
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
        if (!formData.fullName.trim()) {
            errors.fullName = true;
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
                fullName: "Full name is required",
                email: "Please enter a valid email address",
                phoneNumber: "Phone number is required",
                password: "Password must be at least 6 characters",
                confirmPassword: "Passwords do not match",
                companyName: "Company name is required",
                correspondedMe: "Please tell us what corresponded you",
                licenseNumber: "License number is required",
                municipality: "Municipality is required",
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

        if (!validateForm()) {
            return;
        }

        if (formData.role === 'Owner') {
            const ownerData = {
                fullName: formData.fullName,
                companyName: formData.companyName,
                correspondedMe: formData.correspondedMe,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
            };
            dispatch(register(ownerData));
        } else if (formData.role === 'Driver') {
            if (driverStep === 1) {
                setDriverStep(2);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            } else {
                const driverData = {
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    licenseNumber: formData.licenseNumber,
                    municipality: formData.municipality,
                    validUntil: formData.validUntil,
                };
                dispatch(registerDriver(driverData));
            }
        }
    };


    return (
        <>
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
        @keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.slide-in-right {
    animation: slideInRight 0.4s ease-out;
}

.slide-in-left {
    animation: slideInLeft 0.4s ease-out;
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


                            {formData.role === 'Driver' && (
                                <div className="flex items-center justify-center mb-8 gap-2">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${driverStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'}`}>
                                            {driverStep === 1 ? '1' : '✓'}
                                        </div>
                                        <span className={`ml-2 text-sm font-medium ${driverStep === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                            Basic Details
                                        </span>
                                    </div>
                                    <div className={`w-16 h-1 mx-2 ${driverStep === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${driverStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
                                            2
                                        </div>
                                        <span className={`ml-2 text-sm font-medium ${driverStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                                            Verification
                                        </span>
                                    </div>
                                </div>
                            )}

                            <form className="space-y-6">
                                {/* Fake fields to prevent Chrome autofill */}
                                <input type="text" name="fakeusernameremembered" autoComplete="username" className="hidden" />
                                <input type="password" name="fakepasswordremembered" autoComplete="new-password" className="hidden" />

                                {!(formData.role === "Driver" && driverStep === 2) && (

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
                                )}

                                {/* Show fields only after role is selected */}
                                {formData.role && (
                                    <>
                                        {(formData.role === 'Owner' || (formData.role === 'Driver' && driverStep === 1)) && (
                                            <div className="slide-in-right">
                                                {/* First Name - Common for both */}
                                                <div className="mb-6">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: "#424242", fontWeight: 600 }}
                                                    >
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder="John Carter"
                                                        className={`w-full px-4 py-3 border ${fieldErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>


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
                                                        placeholder="you@example.com"
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
                                                        placeholder="+91 98765 43210"
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
                                                            placeholder="Create a strong password"
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
                                                            placeholder="Re-enter your password"
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
                                                                placeholder="e.g., Infocyberbells Pvt. Ltd."
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
                                                                placeholder="Tell us how you heard about us"
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
                                                                placeholder="e.g., DL-0420190145643"
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
                                                                placeholder="e.g., Chandigarh Municipal"
                                                                className={`w-full px-4 py-3 border ${fieldErrors.municipality ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
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
                                            </div>
                                        )}

                                    </>
                                )}

                            </form>

                            {formData.role === "Driver" && driverStep === 2 && (
                                <div className="slide-in-right">
                                    <h2 className="text-2xl font-semibold mb-2 text-center mt-3" style={{ color: "#424242" }}>
                                        Upload Your Photo
                                    </h2>
                                    <p className="mb-6 text-center text-sm" style={{ color: "#BDBDBD" }}>
                                        Please upload a clear photo for verification
                                    </p>

                                    {/* Image Upload Area */}
                                    <div className="mb-6">
                                        {!showUploadArea ? (
                                            // Face Scan Screen (shows first)
                                            <div className="space-y-6">
                                                {/* Face Scan Frame */}
                                                <div className="relative rounded-xl p-8 flex items-center justify-center" style={{ minHeight: '320px' }}>
                                                    <div className="relative w-64 h-64">
                                                        {/* Face mesh image (below) */}
                                                        <img
                                                            src={border}
                                                            alt="Face mesh"
                                                            className="absolute inset-0 w-full h-full object-contain"
                                                        />

                                                        {/* Frame image (on top) */}
                                                        <img
                                                            src={image}
                                                            alt="Frame"
                                                            className="absolute inset-0 w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Security Message */}
                                                <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    <p className="text-sm text-blue-800">
                                                        The data you share will be encrypted, stored securely, and only used to verify your identity
                                                    </p>
                                                </div>

                                                {/* Upload Buttons */}
                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 rounded-xl py-3.5 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Open camera
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowUploadArea(true)}
                                                        className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 rounded-xl py-3.5 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Gallery
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // File Upload Interface (shows after clicking Gallery)
                                            <div
                                                className={`relative border-2 border-dashed ${fieldErrors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer`}
                                                onClick={() => document.getElementById('imageUpload').click()}
                                            >
                                                {imagePreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-64 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedImage(null);
                                                                setImagePreview(null);
                                                                setShowUploadArea(false);
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="py-8">
                                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <p className="text-gray-600 font-medium mb-2">Click to upload or drag and drop</p>
                                                        <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                                                    </div>
                                                )}
                                                <input
                                                    id="imageUpload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Back Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDriverStep(1);
                                            setShowUploadArea(false);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                        className="w-full bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-300 transition-colors mb-3"
                                    >
                                        ← Back to Basic details
                                    </button>
                                </div>
                            )}



                            {/* Sign in button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors mb-2 mt-5"
                            >
                                {isLoading
                                    ? "Please wait..."
                                    : formData.role === "Driver"
                                        ? driverStep === 1
                                            ? "Next"
                                            : "Sign Up"
                                        : "Sign Up"}
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