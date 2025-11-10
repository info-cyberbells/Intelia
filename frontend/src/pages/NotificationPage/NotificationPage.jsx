import React, { useState } from "react";

const NotificationFeed = () => {
  const [visibleCount, setVisibleCount] = useState(4); // show 4 initially
  const [filters, setFilters] = useState({
    comments: true,
    review: true,
    client: false,
    mentions: false,
    drivers: false,
    messages: true,
  });
  const [visibility, setVisibility] = useState("everyone");

  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Leslie Alexander",
      username: "flores",
      action: "Commented on 3D computer improved version",
      date: "Aug 15",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 2,
      name: "Annette Black",
      username: "edwards",
      action: "Commented on Gray vintage 3D computer",
      date: "Apr 11",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 3,
      name: "Cameron Williamson",
      username: "eleanor",
      action: "Commented on Abstract virtual reality personality",
      date: "Nov 30",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: 4,
      name: "Jane Cooper",
      username: "robertson",
      action: "Commented on 3D brush marks",
      date: "Jan 31",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 5,
      name: "Kristin Watson",
      username: "alexander",
      action: "Rated ⭐ 5 for 3D soothing wallpaper",
      date: "Jun 23",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: 6,
      name: "Brooklyn Simmons",
      username: "cooper",
      action: "Purchased 3D dark mode wallpaper",
      date: "Nov 10",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 7,
      name: "Ralph Edwards",
      username: "leonard",
      action: "Shared post: 3D modern UI template",
      date: "Feb 22",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: 8,
      name: "Theresa Webb",
      username: "janet",
      action: "Liked your new design portfolio",
      date: "Mar 14",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const loadLess = () => {
    setVisibleCount((less) => less - 4);
  };

  const toggleAll = (value) => {
    const updated = Object.keys(filters).reduce((acc, key) => {
      acc[key] = value;
      return acc;
    }, {});
    setFilters(updated);
  };

  return (
    <main className="mt-16 ml-56 font-[Inter] min-h-screen bg-gray-50 p-8">
      <div className="flex gap-6">
        {/* ---------- LEFT FEED (3/4) ---------- */}
        <div className="w-3/4 bg-white rounded-2xl shadow-sm p-8">
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="font-[Inter] text-[#303030] font-semibold">NEW</h2>
            </div>
            <div className="space-x-4">
              <select
                className="border border-[#D4D4D4] rounded-lg px-2 py-0.5 font-[Inter] text-[#303030] font-medium text-xs"
                name="All Time"
                id=""
              >
                <option value="">All Time</option>
                <option>Recent</option>
                <option>Oldest</option>
              </select>
              <button><img className="mb-0.5" src="/threeDots.png" alt="" /></button>
            </div>
          </div>
          {comments.slice(0, visibleCount).map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-100 pb-6 pl-6 mb-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-[#303030]  font-bold">
                      {item.name}{" "}
                      <span className="text-gray-400 font-normal">
                        {item.username}
                      </span>
                    </p>
                    <p className="text-sm text-[#303030] font-bold tracking-tight mt-1">
                      <span className="text-[#8A8A8A] font-medium">
                        {item.action.split(" ").slice(0, 2).join(" ")}
                      </span>{" "}
                      {item.action.split(" ").slice(2).join(" ")}
                    </p>
                    <p className="text-sm text-[#303030] font-medium mt-2">
                      “Great work, I just purchased this product”
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <button
                        onClick={() =>
                          setComments((prev) =>
                            prev.map((c) =>
                              c.id === item.id ? { ...c, liked: !c.liked } : c
                            )
                          )
                        }
                        className={`font-bold transition-colors ${
                          item.liked ? "text-[#3565E3]" : "text-[#303030]"
                        }`}
                      >
                        {item.liked ? "Liked" : "Like"}
                      </button>

                      <button className="text-[#303030] font-bold hover:underline">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-xs text-gray-400">{item.date}</p>
                  <span className="w-2 h-2 bg-blue-500 rounded-full mb-[4px]"></span>
                </div>
              </div>
            </div>
          ))}
          {/* Load More / Load Less Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            {visibleCount < comments.length && (
              <button
                onClick={loadMore}
                className="border border-gray-200 text-sm px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-gray-500"><img src="/spinner.png" alt="" /></span> Load more
              </button>
            )}

            {visibleCount > 4 && (
              <button
                onClick={loadLess}
                className="border border-gray-200 text-sm px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-gray-500">↩</span> Load less
              </button>
            )}
          </div>
        </div>

        {/* ---------- RIGHT FILTER PANEL (1/4) ---------- */}
        <div className="w-1/4 bg-white rounded-2xl shadow-sm p-6 sticky top-24 self-start">
          <h2 className="text-base font-semibold mb-4 text-[#303030]">Filter</h2>

          {/* Checkbox Section */}
          <div className="space-y-2 mb-6">
            {Object.keys(filters).map((key) => (
              <label
                key={key}
                className="flex items-center justify-between text-sm font-semibold tracking-tight text-[#303030]"
              >
                <span className="capitalize">{key}</span>
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={() =>
                    setFilters({ ...filters, [key]: !filters[key] })
                  }
                  className="w-4 h-4 accent-[#3565E3] rounded cursor-pointer"
                />
              </label>
            ))}
          </div>

          {/* Select / Unselect All */}
          <div className="flex justify-between gap-2 mt-4 mb-6">
            <button
              onClick={() => toggleAll(true)}
              className="flex-1 border py-2 rounded-lg border-[#D4D4D4] text-sm text-[#303030] font-semibold hover:bg-gray-50"
            >
              Select all
            </button>
            <button
              onClick={() => toggleAll(false)}
              className="flex-1 border border-[#D4D4D4] py-2 rounded-lg text-sm text-[#303030] font-semibold hover:bg-gray-50"
            >
              Unselect all
            </button>
          </div>

          <hr className="my-4 text-[#D4D4D4]" />

          {/* Radio Options */}
          <div className="space-y-3 text-sm text-[#303030] font-medium">
            <label className="flex items-center justify-between">
              <span>Owner</span>
              <input
                type="radio"
                name="visibility"
                checked={visibility === "owner"}
                onChange={() => setVisibility("owner")}
                className="accent-[#3565E3]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Everyone</span>
              <input
                type="radio"
                name="visibility"
                checked={visibility === "everyone"}
                onChange={() => setVisibility("everyone")}
                className="accent-[#3565E3]"
              />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotificationFeed;
