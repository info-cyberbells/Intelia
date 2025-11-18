import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from '../../context/ToastContext';


const ForgotPassword = ({ setToken }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [otpData, setOtpData] = useState({
        newPassword: "",
        confirmPassword: ""
    });




    return (
        <>
            <style>{`
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background decorative circles */}
                <div className="absolute top-16 left-40 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
                <div className="absolute top-36 left-40 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
                {/* <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-50"></div>
            <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
            <div className="absolute top-10 right-40 w-20 h-20 bg-blue-100 rounded-full opacity-40"></div> */}

                <div className="absolute bottom-24 right-20 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
                <div className="absolute bottom-24 right-40 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>

                {/* Main container */}
                <div className="w-full max-w-6xl flex items-center justify-between gap-16">

                    {/* Left side - Phone mockup with concentric circles */}
                    <div className="hidden lg:flex flex-1 items-center justify-center relative pr-20 ">
                        {/* Outer circle with location icons - Big Circle */}
                        <div className="absolute w-[550px] h-[550px] rotate-circle">
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

                    {/* Right side - Main login form */}
                    <div className="flex-1 max-w-md w-full relative -top-4">
                        <div className="rounded-2xl p-10">
                            <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: "#424242" }}>Change Password</h1>
                            <p className="mb-6 text-center" style={{ color: "#BDBDBD", fontWeight: "400" }}>Set your new password
                            </p>

                            <form className="space-y-6">

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: "#424242", fontWeight: 600 }}>
                                        New Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={otpData.newPassword}
                                            onChange={(e) => setOtpData({ ...otpData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />

                                        {/* Eye Icon */}
                                        <span
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                        >
                                            {showNewPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                                :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: "#424242", fontWeight: 600 }}>
                                        Confirm Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={otpData.confirmPassword}
                                            onChange={(e) => setOtpData({ ...otpData, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />

                                        {/*  Eye Icon */}
                                        <span
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                        >
                                            {showConfirmPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                                :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>}
                                        </span>
                                    </div>
                                </div>
                            </form>


                            {/* Sign in button */}
                            <button type="submit" disabled={isLoading}
                                className="w-full bg-blue-600 mt-5 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors  mb-2"
                            >
                                Change Password
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;