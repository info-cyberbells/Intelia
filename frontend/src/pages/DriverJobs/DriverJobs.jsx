import React, { useState } from "react";
import { Search, MapPin, Truck, DollarSign, SlidersHorizontal, X, Bookmark, BookmarkCheck } from "lucide-react";

const JobListingInterface = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [savedJobs, setSavedJobs] = useState(new Set());

    const tabs = [
        { id: "all", label: "All Jobs" },
        { id: "saved", label: "Saved Jobs" },
        { id: "applied", label: "Applied Jobs" },
        { id: "recommended", label: "Recommended Jobs" }
    ];

    const jobData = [
        {
            id: 1,
            company: "V.A.S. Automotive India Pvt. Ltd.",
            type: "Full-Time",
            title: "Luxury Car Workshop Driver",
            description: "Transport customer and company vehicles (luxury brands) between showroom & workshop. Must ensure vehicle safety and condition.",
            pay: "₹10,000-18,000/month",
            duration: "6 days/week",
            vehicle: "Light vehicle"
        },
        {
            id: 2,
            company: "Vaan Electric Moto Pvt. Ltd.",
            type: "Full-Time",
            title: "Delivery Driver – E-two-wheeler",
            description: "Deliver parcels & documents across city using EV scooter. Training provided. Full time permanent role.",
            pay: "₹20,000-22,000/month",
            duration: "5 days/week",
            vehicle: "Scooter (EV)"
        },
        {
            id: 3,
            company: "Meta Furniture",
            type: "Full-Time",
            title: "Company Driver – Furniture Deliveries",
            description: "Safe & timely delivery of furniture to retail shops and customers. Must maintain vehicle and delivery logs.",
            pay: "₹15,000-18,000/month",
            duration: "6 days/week",
            vehicle: "Light vehicle / van"
        },
        {
            id: 4,
            company: "Nectar Fresh",
            type: "Full-Time",
            title: "Personal Car Driver – Deliveries",
            description: "Operate company car for delivery of orders, manage route navigation and customer handovers. Valid licence required.",
            pay: "₹15,000-20,000/month",
            duration: "5 days/week",
            vehicle: "Car"
        },
        {
            id: 5,
            company: "Dr. Kochar's House of Smiles",
            type: "Contract",
            title: "Delivery Executive – Medical Supplies",
            description: "Deliver medical supplies & equipment in metro zone. Must follow safety protocols and maintain delivery schedule.",
            pay: "₹15,000-17,000/month",
            duration: "6 days/week",
            vehicle: "Two-wheeler"
        },
        {
            id: 6,
            company: "KVR TATA",
            type: "Full-Time",
            title: "Driver – Fleet Operations",
            description: "Drive assigned vehicles for logistics company. Maintain vehicle readiness, adhere to schedule and safety norms.",
            pay: "₹11,000-12,000/month",
            duration: "6 days/week",
            vehicle: "Light/Medium vehicle"
        },
        {
            id: 7,
            company: "Amazon Logistics Partner",
            type: "Full-Time",
            title: "Delivery Driver – 2W/3W",
            description: "Deliver packages for e-commerce platform in metropolitan zone. Early starts, high productivity expected.",
            pay: "₹₹XXXX/month + incentives",  // you can update the exact value
            duration: "6 days/week",
            vehicle: "Two-wheeler / 3-wheeler"
        },
        {
            id: 8,
            company: "Uber – Drive Platform",
            type: "Flexible / Gig",
            title: "Driver – Own Vehicle",
            description: "Use your own vehicle, set flexible hours, earn per ride or delivery. Ideal for drivers looking flexible schedule.",
            pay: "Variable (based on trips)",
            duration: "Flexible",
            vehicle: "Car / Two-wheeler"
        }
    ];


    const toggleSave = (jobId) => {
        setSavedJobs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans lg:ml-56 mt-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                    {/* Search Bar */}
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[250px] max-w-md">
                        <input
                            type="text"
                            placeholder="Search jobs here"
                            className="flex-1 outline-none text-sm text-gray-700"
                        />
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            AI
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            Location
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            Vehicle Type
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            Pay Type
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            Sort By
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
                            Reset Filters
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Job Cards Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {jobData.map(job => (
                        <div
                            key={job.id}
                            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                        >
                            {/* Company Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900">{job.company}</h3>
                                </div>
                            </div>

                            {/* Job Type Badge */}
                            <div className="mb-3">
                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                    {job.type}
                                </span>
                            </div>

                            {/* Job Title */}
                            <h4 className="text-base font-semibold text-gray-900 mb-2">{job.title}</h4>

                            {/* Job Description */}
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{job.description}</p>

                            {/* Key Info */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-600">
                                    <span className="font-medium">Key info:</span> {job.pay} | {job.duration} | {job.vehicle}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => toggleSave(job.id)}
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {savedJobs.has(job.id) ? (
                                        <BookmarkCheck className="w-4 h-4" />
                                    ) : (
                                        <Bookmark className="w-4 h-4" />
                                    )}
                                    Save
                                </button>
                                <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobListingInterface;