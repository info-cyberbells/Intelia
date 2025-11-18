import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDriverSettings, updateDriverSettings, postDriverFeedback } from "../../features/Drivers/driverSlice";
import { useToast } from "../../context/ToastContext";
import { fetchOwnerSettings, updateOwnerSettings } from "../../features/ownerSlice/ownerSlice";



const Settings = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    // const { settings, loading } = useSelector((state) => state.drivers);

    const getRole = () => {
        try {
            const raw = localStorage.getItem("user"); 
            if (!raw) return null;

            const user = JSON.parse(raw);
            return user.role || null;
        } catch {
            return null;
        }
        };

    const role = getRole();

const driverState = useSelector((state) => state.drivers);
const ownerState = useSelector((state) => state.owner);

const settings = role === "owner" ? ownerState.settings : driverState.settings;
const loading = role === "owner" ? ownerState.loading : driverState.loading;


    const [toggles, setToggles] = useState({
        email: false,
        inApp: false,
        darkMode: false,
    });

    const [feedBack, setfeedBack] = useState("");



    // useEffect(() => {
    //     dispatch(fetchDriverSettings());
    // }, [dispatch]);

    useEffect(() => {
    const role = getRole();

        if (role === "driver") {
            dispatch(fetchDriverSettings());
        } 
        else if (role === "owner") {
            dispatch(fetchOwnerSettings());
        }
    }, [dispatch]);



    useEffect(() => {
        if (settings) {
            setToggles({
                email: settings.emailNotification || false,
                inApp: settings.inAppNotification || false,
                darkMode: settings.darkMode || false,
            });
        }
    }, [settings]);


    // const handleToggle = (key) => {
    //     const newToggles = { ...toggles, [key]: !toggles[key] };
    //     setToggles(newToggles);

    //     const updatedData = {
    //         emailNotification: newToggles.email,
    //         inAppNotification: newToggles.inApp,
    //         darkMode: newToggles.darkMode,
    //     };

    //     dispatch(updateDriverSettings(updatedData))
    //         .unwrap()
    //         .then(() => showToast("Settings updated successfully!", "success"))
    //         .catch(() => showToast("Failed to update settings!", "error"));
    // };

    const handleToggle = (key) => {
    const newToggles = { ...toggles, [key]: !toggles[key] };
    setToggles(newToggles);

    const payload = {
        emailNotification: newToggles.email,
        inAppNotification: newToggles.inApp,
        darkMode: newToggles.darkMode,
    };

    const role = getRole();

    if (role === "driver") {
        dispatch(updateDriverSettings(payload))
            .unwrap()
            .then(() => showToast("Driver settings updated!", "success"))
            .catch(() => showToast("Failed to update settings!", "error"));
    }

    if (role === "owner") {
        dispatch(updateOwnerSettings(payload))
            .unwrap()
            .then(() => showToast("Owner settings updated!", "success"))
            .catch(() => showToast("Failed to update settings!", "error"));
    }
};


    const handleSubmit = () => {
        if (!feedBack.trim()) {
            showToast("Please enter your feedback!", "error");
            return;
        }

        dispatch(postDriverFeedback({ message: feedBack }))
            .unwrap()
            .then(() => {
                showToast("Feedback submitted successfully!", "success");
                setfeedBack("");
            })
            .catch((err) => {
                showToast(err || "Failed to submit feedback!", "error");
            });
    };
    return (
        <div className="bg-[#F5F5F5] ml-56 min-h-screen p-8 mx-auto mt-16 font-[Inter]">

            <div className="p-8 rounded-2xl max-w-4xl bg-white shadow-sm">
                {loading && (
                    <p className="text-gray-500 text-sm mb-4">Loading settings...</p>
                )}
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

                        {/*  Language & Display */}
                        <div>
                            <h3 className="font-medium text-[#333B69] mb-4">
                                Language & Display
                            </h3>
                            <div className="space-y-3">
                                {[
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
                <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-[#333B69] mb-3">Contact Support</h3>

                    <div className="space-y-2">
                        <p className="text-sm text-[#232323]">
                            📞 <span className="font-medium">Phone:</span> +1 (800) 555-1234
                        </p>
                        <p className="text-sm text-[#232323]">
                            ✉️ <span className="font-medium">Email:</span>{" "}
                            <a
                                href="mailto:support@antelia.com"
                                className="text-blue-600 hover:underline"
                            >
                                support@antelia.com
                            </a>
                        </p>
                    </div>
                </div>

                {role === "driver" && ( <>
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
                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`bg-[#3565E3] text-white px-12 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                </div></>
                )}
                
            </div>
        </div>
    );
};

export default Settings;
