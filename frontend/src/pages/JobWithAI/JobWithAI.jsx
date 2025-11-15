import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import addicon from "/menuicons/add_circle.svg";


const JobWithAI = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-[Poppins] mt-12 bg-gray-50 flex flex-col py-10 px-6 md:px-14 lg:ml-56">
            {/* Header */}
            <div className="flex justify-between mb-10">
                <div className="">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#3565E3] mb-2">
                        Talent Hub
                    </h2>
                    <p className="text-gray-500 text-base">
                        Create your job ads by simply talking to Mia, your smart assistant.
                    </p>
                </div>
                <div>
                    {/* top right  side text space */}

                </div>

            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ---------- Left Column ---------- */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800">
                        Previous Search History
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            "Weather",
                            "Medical Equipment",
                            "Traffic Signals",
                            "Path Recognition",
                            "Alarm",
                            "Facts",
                            "Movies",
                            "Cartoons",
                            "Restaurants",
                            "Cloths Stores",
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#3565E31A] rounded-xl p-4 flex flex-col justify-between h-24 hover:shadow transition"
                            >
                                <span className="font-bold font-titillium text-xs text-[#3565E3]">
                                    {item.toUpperCase()}
                                </span>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div
                                        className="bg-yellow-400 h-1 rounded-full"
                                        style={{
                                            width: `${Math.floor(Math.random() * 60) + 20}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
                        <div className="w-10 h-10 rounded-full bg-[#3565E31A] flex items-center justify-center text-white text-lg shadow-sm">
                            ↓
                        </div>
                    </div>
                </div>

                {/* ---------- Middle Column: Mia Assistant ---------- */}
                <div className="flex flex-col items-center justify-between">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
                            Mia - Assistant Vocal
                        </h3>
                        <p className="text-gray-500 text-sm mb-8">
                            Specialized AI Assistant for Ivory Coast
                        </p>

                        {/* Dotted Line Wave Animation */}
                        {/* <div className="relative w-full max-w-2xl h-40 mb-8 overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 1200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4FD1C5" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>

                <path
                  d="M0 100 Q150 50 300 100 T600 100 T900 100 T1200 100"
                  stroke="url(#gradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="3 6"
                  className="animate-waveDots"
                />
                <path
                  d="M0 120 Q150 80 300 120 T600 120 T900 120 T1200 120"
                  stroke="url(#gradient)"
                  strokeWidth="1.8"
                  fill="none"
                  strokeDasharray="2 8"
                  className="animate-waveDotsSlow opacity-70"
                />
              </svg>
            </div> */}

                        {/* --- Voice Bar Animation --- */}
                        <div className="flex items-end justify-center space-x-1 my-16  h-20">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-0.5 bg-gradient-to-t from-blue-300 to-purple-400 rounded-full animate-wave"
                                    style={{
                                        animationDelay: `${i * 0.05}s`,
                                        height: `${Math.random() * 60 + 20}px`,
                                    }}
                                ></div>
                            ))}
                        </div>

                        {/* Listening Section */}
                        <p className="text-gray-600 font-medium mb-2">
                            Active Leader - Voice Ready
                        </p>
                        <p className="text-3xl font-turret font-medium text-gray-900 mb-4">
                            listening...
                        </p>

                        {/* Mic Icon */}
                        <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#F3CD48"
                                className="w-12 h-12"
                            >
                                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
                                <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-3.07A7 7 0 0 0 19 11z" />
                            </svg>
                        </div>

                        <button className="bg-[#3565E3] hover:bg-blue-700 text-white text-xs font-thin px-16 py-3 mt-6 rounded-lg shadow-md transition-all">
                            Submit
                        </button>
                    </div>
                </div>

                {/* ---------- Right Column ---------- */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-titillium font-semibold text-gray-800 mb-4">
                        Searched By Command
                    </h3>

                    <div className="space-y-5">
                        <div>
                            <p className="text-[#3565E3] text-sm">Title</p>
                            <p className="text-black text-xs font-semibold">Hover Board</p>
                        </div>

                        <div>
                            <p className="text-[#3565E3] text-sm">Category</p>
                            <p className="text-black text-xs font-semibold">
                                Personal Transporter
                            </p>
                        </div>

                        <div className="flex justify-between">
                            <div>
                                {/* Label */}
                                <p className="text-[#3565E3] text-sm mb-1">Search Results</p>

                                {/* View All below the label */}
                                <span className="text-black text-xs font-semibold cursor-pointer hover:underline block mb-2">
                                    View All
                                </span>
                            </div>

                            {/* Percentage + View Top Results */}
                            <div className="flex flex-col items-start">
                                <p className="text-[#3565E3] font-medium text-sm leading-tight">
                                    92.8%
                                </p>
                                <span className="text-black text-xs font-semibold cursor-pointer hover:underline mt-1">
                                    View Top Results
                                </span>
                            </div>
                        </div>

                        {/* Videos Section */}
                        <div className="font-titillium">
                            <p className="text-[#3565E3] text-sm font-semibold mb-2">
                                Videos
                            </p>
                            <div className="bg-blue-50 rounded-xl">
                                <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-between mb-1 cursor-pointer transition">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src="https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg"
                                            alt="Hover Board Review"
                                            className="w-16 h-10 rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-xs">
                                                Hover Board Review
                                            </p>
                                            <p className="text-xs text-gray-500">YOUTUBE</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <button className="bg-black text-white py-2 rounded-full hover:bg-blue-700 transition focus:outline-none border-none flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-between mb-1 cursor-pointer transition">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
                                            alt="Hover Board Unboxing"
                                            className="w-16 h-10 rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold mb-1 text-xs">
                                                Hover Board Unboxing
                                            </p>
                                            <p className="text-xs text-gray-500">YOUTUBE</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <button className="bg-black text-white py-2 rounded-full hover:bg-blue-700 transition focus:outline-none border-none flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <p className="text-blue-700 text-xs text-center px-4 pb-2 cursor-pointer hover:underline">
                                    View All
                                </p>
                            </div>
                        </div>

                        {/* 3D City Preview */}
                        <div className="mt-8">
                            <p className="text-blue-700 text-sm font-medium mb-3">
                                Lorem Ipsum
                            </p>
                            <img
                                src="https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="3D City"
                                className="rounded-xl w-full object-cover shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes wave {
          0% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(0.4);
          }
        }
        .animate-wave {
          animation: wave 1.4s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
        </div >
    );
};

export default JobWithAI;
