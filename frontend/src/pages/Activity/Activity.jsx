import React from "react";

const Activity = () => {
  const today = [
    {
      id: 1,
      text: (
        <>
          <span className="font-semibold text-gray-900">Karen Hope</span> has
          created new task at{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Frize driver
          </span>
        </>
      ),
    },
    {
      id: 2,
      text: (
        <>
          <span className="text-blue-600 font-semibold">[REMINDER]</span> Due
          date of{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Expiring License
          </span>{" "}
          will be coming
        </>
      ),
    },
    {
      id: 3,
      text: (
        <>
          <span className="font-semibold text-gray-900">Tony Soap</span>{" "}
          commented at{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Frize post
          </span>
        </>
      ),
    },
    {
      id: 4,
      text: (
        <>
          <span className="font-semibold text-gray-900">Samantha William</span>{" "}
          add 4 files on{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Frize Post
          </span>
        </>
      ),
    },
    {
      id: 5,
      text: (
        <>
          <span className="font-semibold text-gray-900">You</span> has moved{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            “new driver”
          </span>{" "}
          task to{" "}
          <span className="font-semibold text-gray-900">Assign</span>
        </>
      ),
    },
  ];

  const yesterday = [
    {
      id: 1,
      text: (
        <>
          <span className="font-semibold text-gray-900">Johnny Ahmad</span>{" "}
          mentioned you at{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Lorem Ipsum
          </span>
        </>
      ),
    },
    {
      id: 2,
      text: (
        <>
          <span className="font-semibold text-gray-900">Nadila Adja</span>{" "}
          mentioned you at{" "}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Lorem Ipsum
          </span>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl ml-56 mt-14 font-[Poppins] shadow-sm p-6 mx-auto text-gray-700">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-2 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#363B64]">
          Activity
        </h2>

        <div className="flex items-center flex-wrap">
          <button className="px-4 py-2 text-sm font-normal text-white bg-blue-600 shadow-sm hover:bg-blue-700 transition">
            Activity
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#A098AE] bg-gray-100 hover:bg-gray-200 transition">
            Notifications
          </button>

          <div className="relative">
            <select className="px-4 py-2 ml-4 text-sm font-medium text-gray-500 border bg-white cursor-pointer">
              <option>Recently</option>
              <option>Oldest</option>
            </select>
          </div>
          <div className="text-gray-500 text-2xl ml-4 pb-4 font-bold cursor-pointer select-none hover:text-gray-700">
            ...
          </div>
        </div>
      </div>
                  {/* <h3 className="font-semibold text-gray-900 mb-2">Today</h3> */}

      {/* Timeline Container */}
      <div className="relative pl-10">
  {/* === TODAY SECTION === */}
  <div className="relative mb-12">
    {/* Today Title (above its line) */}
    <h3 className="font-bold text-[#363B64] mb-6 relative z-10 -ml-8 bg-white pr-2 inline-block">
      Today
    </h3>

    {/* Line for Today section only */}
    <div className="absolute top-8 -left-6 w-[2px] bg-gray-200 h-[calc(100%-2rem)]"></div>

    {today.map((item, index) => (
      <div key={item.id} className="relative mb-8">
        {/* Square on timeline */}
        <div className="absolute -left-[2rem] top-1 w-4 h-4 bg-gray-300 "></div>

        {/* Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1 text-sm sm:text-base leading-relaxed">
            {item.text}

            {/* Skeleton images */}
            {index === 0 && (
              <div className="mt-3 flex gap-3">
                 {/* <img
                  src="https://source.unsplash.com/random/400x300/?office,work"
                  alt="Office"
                  className="w-40 h-24 rounded-md object-cover"
                /> */}
                <div className="w-40 h-24 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="w-40 h-24 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            )}

            {index === 3 && (
              <div className="mt-3 flex gap-3 flex-wrap">
                <div className="w-40 h-24 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="w-40 h-24 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="w-40 h-24 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="w-40 h-24 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            )}
          </div>

          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            Monday, June 31 2020
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* === YESTERDAY SECTION === */}
  <div className="relative">
    {/* Yesterday Title (above its line) */}
    <h3 className="font-bold text-[#363B64] mb-6 -ml-8 relative z-10 bg-white pr-2 inline-block">
      Yesterday
    </h3>

    {/* Line for Yesterday section only */}
    <div className="absolute top-8 -left-6 w-[2px] bg-gray-200 h-[calc(100%-2rem)]"></div>

    {yesterday.map((item) => (
      <div key={item.id} className="relative mb-8">
        {/* Square on timeline */}
        <div className="absolute -left-[2rem] top-1 w-4 h-4 bg-gray-300"></div>

        {/* Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <p className="flex-1 text-sm sm:text-base leading-relaxed">
            {item.text}
          </p>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            Monday, June 31 2020
          </span>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Load More Button */}
      <div className="flex justify-center mt-6">
        <button className="px-6 py-2 text-sm font-thin text-[#FCFCFC] bg-blue-600 hover:bg-blue-700 transition">
          Load More
        </button>
      </div>
    </div>
  );
};

export default Activity;
