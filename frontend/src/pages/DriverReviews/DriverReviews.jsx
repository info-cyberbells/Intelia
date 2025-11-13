import React from "react";
import { Link } from "react-router-dom";
import addicon from "/menuicons/add_circle.svg";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Leticia Kutch",
      rating: 4.8,
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Sapiente occaecati exercitationem quasi eum corporis sit. Consectetur maxime debitis quam voluptatem.",
    },
    {
      id: 2,
      name: "John Carter",
      rating: 4.3,
      img: "https://randomuser.me/api/portraits/men/36.jpg",
      text: "Aut consequatur voluptatum et molestiae doloremque culpa. Doloribus officia beatae nisi.",
    },
    {
      id: 3,
      name: "Sara Mitchell",
      rating: 4.9,
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Velit repellendus cupiditate accusamus! Doloremque consequuntur temporibus amet quaerat et.",
    },
    {
      id: 4,
      name: "Sara Mitchell",
      rating: 4.9,
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Velit repellendus cupiditate accusamus! Doloremque consequuntur temporibus amet quaerat et.",
    },
  ];

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div className="ml-56 mt-16 font-[Poppins]  min-h-screen bg-[#F5F5F7] p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-[Poppins] text-[#363B64] font-bold">
          Driver Ratings & Reviews
        </h1>

        <div className="flex gap-4 items-center">
          <span className="px-4 py-2 bg-[#3565E3] text-[#FFFFFF] text-sm font-light rounded-2xl">
            Average Rating {avg.toFixed(1)}
          </span>

          <Link
            to="/add-review"
            className="flex gap-2 px-5 py-2 text-sm border border-[#3565E3] text-[#3565E3] rounded-2xl hover:bg-blue-50"
          >
            Add Review <img src={addicon} alt="" />
          </Link>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white shadow-md p-6 rounded-xl border border-gray-100"
          >
            <img
              src={r.img}
              alt=""
              className="w-25 h-25 rounded-full shadow-xl mx-auto mb-3 object-cover"
            />

            <h3 className="text-center font-semibold text-lg leading-[39.43px]">
              {r.name}
            </h3>

            {/* ⭐ Rating + Stars */}
            <div className="flex justify-center items-center gap-2 mt-1">
              <p className="font-medium text-sm">{r.rating.toFixed(1)} / 5.0</p>

              {/* Stars */}
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const starNumber = i + 1;
                  return starNumber <= Math.round(r.rating) ? (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ) : (
                    <span key={i} className="text-gray-300 text-xl">
                      ★
                    </span>
                  );
                })}
              </div>
            </div>

            <p className="text-[#333333] font-normal text-sm mt-3 text-center leading-[35.85px]">
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
