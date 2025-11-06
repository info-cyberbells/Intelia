import React from 'react';

const RecentDrivers = () => {
  const drivers = [
    {
      name: 'Samantha William',
      role: 'Marketing Manager',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Tony Soap',
      role: 'UI Designer',
      img: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      name: 'Karen Hope',
      role: 'Web Developer',
      img: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'Jordan Nico',
      role: 'Graphic Designer',
      img: 'https://randomuser.me/api/portraits/men/52.jpg',
    },
    {
      name: 'Nadila Adja',
      role: 'QA Engineer',
      img: 'https://randomuser.me/api/portraits/women/21.jpg',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-5 sm:p-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#363B64]">
            Recent Drivers
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            You have 456 Drivers
          </p>
        </div>
        <button className="w-9 h-9 rounded-md bg-blue-600 grid place-items-center text-white text-xl font-light shadow-sm hover:bg-blue-700 transition">
          +
        </button>
      </div>

      {/* Driver List */}
      <div className="space-y-2.5">
        {drivers.map((u, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md p-2.5 hover:bg-gray-50 transition"
          >
            {/* Avatar */}
            <img
              src={u.img}
              alt={u.name}
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
            />

            {/* User Info */}
            <div className="flex-1">
              <p className="font-medium text-[13px] text-gray-800 leading-tight">
                {u.name}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{u.role}</p>
            </div>

            {/* Message Action */}
            <div className="w-7 h-7 rounded-md grid place-items-center hover:bg-gray-100 transition">
              <img
                src="/message.png"
                alt="Mail Icon"
                className="w-5 h-5 object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <button className="mt-5 w-full py-2.5 rounded-md bg-[#6E6CDF1A] text-blue-700 text-sm font-semibold hover:bg-blue-100 transition">
        View More
      </button>
    </div>
  );
};

export default RecentDrivers;
