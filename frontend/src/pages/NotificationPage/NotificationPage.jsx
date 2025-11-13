import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDriverNotifications } from "../../features/notifications/notificationSlice";


const NotificationFeed = () => {
  const [filters, setFilters] = useState({
    comments: true,
    review: true,
    client: false,
    mentions: false,
    drivers: false,
    messages: true,
  });
  const [visibility, setVisibility] = useState("everyone");

  const dispatch = useDispatch();
  const { data: notifications, loading } = useSelector((state) => state.notifications);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    dispatch(fetchDriverNotifications());
  }, [dispatch]);


  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const loadLess = () => {
    setVisibleCount((less) => less - 4);
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
          </div>
          {loading && (
            <p className="text-center text-gray-500 text-sm mb-4">Loading...</p>
          )}

          {!loading && notifications.length === 0 && (
            <p className="text-center text-gray-500 text-sm mb-4">
              No notifications found
            </p>
          )}

          {!loading &&
            notifications.slice(0, visibleCount).map((item) => (
              <div
                key={item._id}
                className="border-b border-gray-100 pb-6 pl-6 mb-6 flex justify-between items-start"
              >
                <div className="flex items-start gap-3">
                  {/* Default notification icon */}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                    alt="notification"
                    className="w-10 h-10 rounded-full bg-gray-100 p-1"
                  />
                  <div>
                    <p className="text-sm text-[#303030] font-bold">{item.title}</p>
                    <p className="text-sm text-[#303030] mt-1">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  {item.isRead === false && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mb-[4px]"></span>
                  )}
                </div>
              </div>
            ))}

          {/* Load More / Load Less Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            {visibleCount < notifications.length && (
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

      </div>
    </main>
  );
};

export default NotificationFeed;
