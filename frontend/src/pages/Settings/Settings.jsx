import React, { useState } from "react";

const Settings = () => {
    const [toggles, setToggles] = useState({
        email: true,
        sms: false,
        inApp: true,
        italian: true,
        darkMode: false,
    });

    const handleToggle = (key) =>
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

    const [feedBack, setfeedBack] = useState("");

    const handleSubmit = () => {
        console.log("Feedback Submitted!!", feedBack);
        setfeedBack("");
    }

    return (
        <div className="bg-[#F5F5F5] ml-56 min-h-screen p-8 mx-auto mt-16 font-[Inter]">

            <div className="p-8 rounded-2xl max-w-4xl bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-gray-200 mb-6">
                    <h2 className="text-blue-600 font-medium text-sm border-b-2 border-blue-600 w-fit pb-1">
                        Preferences
                    </h2>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Notifications */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-[#333B69] mb-4">Notification</h3>
                            <div className="space-y-3">
                                {[
                                    { key: "email", label: "Email Notifications" },
                                    { key: "sms", label: "SMS Notifications" },
                                    { key: "inApp", label: "In-App Notifications" },
                                ].map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex justify-between items-center"
                                    >
                                        <p className="text-[#232323] text-sm">{item.label}</p>
                                        <button
                                            onClick={() => handleToggle(item.key)}
                                            className={`w-10 h-5 flex items-center rounded-full transition ${toggles[item.key] ? "bg-blue-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full transform transition ${toggles[item.key] ? "translate-x-5" : "translate-x-0.5"
                                                    }`}
                                            ></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🌐 Language & Display */}
                        <div>
                            <h3 className="font-medium text-[#333B69] mb-4">
                                Language & Display
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { key: "italian", label: "Italian" },
                                    { key: "darkMode", label: "Dark Mode" },
                                ].map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex justify-between items-center"
                                    >
                                        <p className="text-[#232323] text-sm">{item.label}</p>
                                        <button
                                            onClick={() => handleToggle(item.key)}
                                            className={`w-10 h-5 flex items-center rounded-full transition ${toggles[item.key] ? "bg-blue-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full transform transition ${toggles[item.key] ? "translate-x-5" : "translate-x-0.5"
                                                    }`}
                                            ></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/*Empty Right Column */}
                    <div></div>
                </div>

                {/*  Contact Support */}
                <div className="mt-6">
                    <h3 className="font-medium text-[#333B69] mb-3">Contact Support</h3>
                    <p className="text-sm text-[#232323]">
                        Call us at: <span>+00000000000</span>
                    </p>
                    <p className="text-sm text-[#232323] mt-1">
                        Email us at: <span>Antelia@gmail.com</span>
                    </p>
                </div>

                {/* 💬 Feedback */}
                <div className="mt-8">
                    <label className="block text-[#333B69] font-medium text-sm mb-2">
                        Feedback
                    </label>
                    <textarea
                        rows="3"
                        placeholder="Rate your experience"
                        value={feedBack}
                        onChange={(e) => setfeedBack(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 focus:ring-1 focus:ring-blue-100 outline-none resize-none"
                    />
                </div>

                {/* ✅ Submit Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-[#3565E3] text-white px-12 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
