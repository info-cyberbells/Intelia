import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const AddReview = () => {
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverValue, setHoverValue] = useState(null);
  const [text, setText] = useState("");

  const display = hoverValue ?? rating;

  const getStarIcon = (value, index) => {
    const starNum = index + 1;

    if (value >= starNum)
      return <FaStar className="text-yellow-400" size={28} />;

    if (value >= starNum - 0.5)
      return <FaStarHalfAlt className="text-yellow-400" size={28} />;


    return <FaStar className="text-[#D9D9D9]" size={28} />;
  };


  const handleMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    const percent = x / box.width;

    let value = (percent * 5).toFixed(1);
    value = Math.min(5, Math.max(0.1, value));

    const val = parseFloat(value);

    setHoverValue(val);
    setRating(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Review submitted successfully!");
    navigate(-1);

  };

  return (
    <div className="mt-16 ml-56 p-10 bg-[#F5F5F7] min-h-screen">
      <div>
        <h2 className="text-3xl text-[#363B64] font-bold mb-10 ">
          Add Driver Ratings & Reviews
        </h2>

        <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">

          {/* Rating */}
          <label className="block text-[#232323] text-base font-medium mb-2">
            Rate the Driver
          </label>

          <div
            className="flex items-center gap-1 cursor-pointer mb-6 justify-start"
            style={{ width: "155px" }}
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverValue(null)}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>{getStarIcon(display, i)}</div>
            ))}

            <span className="ml-3 font-semibold text-sm">{display.toFixed(1)}</span>
          </div>

          {/* Review */}
          <label className="block text-[#232323] text-base font-medium mt-2">
            Review
          </label>

          <textarea
            className="w-full mt-5 text-[#919191] border rounded-lg p-3 h-32"
            placeholder="Write review here"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Buttons */}
          <div className="flex justify-start gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-[#3565E3] border border-[#3565E3] rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#3565E3] border-[#3565E3] text-white rounded-xl"
            >
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddReview;
