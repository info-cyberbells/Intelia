import React, { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Video,
  MoreVertical,
  Plus,
} from "lucide-react";

const Drivers = () => {
  const [contacts] = useState([
    {
      id: 1,
      name: "Jordana Niclany",
      phone: "+1234567890",
      email: "jordan@mail.com",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      isOnline: true,
    },
    {
      id: 2,
      name: "Jacob Jack",
      phone: "+1234567890",
      email: "jordan@mail.com",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      isOnline: true,
    },
    {
      id: 3,
      name: "Jordan Nico",
      phone: "+1234567890",
      email: "jordan@mail.com",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      isOnline: true,
    },
    {
      id: 4,
      name: "Gibs Gibsy",
      phone: "+1234567890",
      email: "jordan@mail.com",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
      isOnline: true,
    },
    {
      id: 5,
      name: "Sam Sammy",
      phone: "+1234567890",
      email: "jordan@mail.com",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
      isOnline: true,
    },
    {
      id: 6,
      name: "Corey Core",
      phone: "+1234567890",
      email: "jordan@mail.com",
      image:
        "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop",
      isOnline: true,
    },
  ]);

  const stats = [
    {
      icon: "🚗",
      label: "Total Drivers",
      value: "932",
      bgColor: "bg-orange-50",
    },
    { icon: "📄", label: "Risk Scored", value: "1,032", bgColor: "bg-blue-50" },
    { icon: "🎁", label: "Low Risk", value: "0", bgColor: "bg-purple-50" },
    { icon: "👥", label: "Licenses", value: "32k", bgColor: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:ml-56">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Contact</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
          Add Driver
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`${stat.bgColor} w-14 h-14 rounded-lg flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Contact Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative">
                <img
                  src={contact.image}
                  alt={contact.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                {contact.isOnline && (
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-sm"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {contact.phone}
                    </p>
                    <p className="text-gray-400 text-sm">{contact.email}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-lg flex items-center justify-center transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
