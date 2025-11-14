import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnerSideDriverReviews } from "../../features/Drivers/driverSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import addicon from "/menuicons/add_circle.svg";

const Reviews = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { reviews, averageRating, totalReviews, loading } = useSelector(
        (state) => state.drivers
    );

    useEffect(() => {
        dispatch(fetchOwnerSideDriverReviews(id));
    }, [id]);



    return (
        <div className="ml-56 mt-16 font-[Poppins]  min-h-screen bg-[#F5F5F7] p-10">
            <div className="flex justify-end gap-4 mb-6">
                
                 <span className="px-4 py-2 bg-[#3565E3] text-white  text-sm rounded-2xl">
                        Average Rating : {averageRating}
                    </span>

                    <Link
                        to={`/add-review/${id}`}
                        className="flex gap-2 px-5 py-2 text-sm border border-[#3565E3] text-[#3565E3] rounded-2xl hover:bg-blue-50" >
                        Add Review <img src={addicon} alt="" /> </Link>
            </div>

            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-[Poppins] text-[#363B64] font-bold">
                    Driver Ratings & Reviews
                </h1>

                <div className="flex gap-4 items-center">
                   <button
                    onClick={() => navigate("/drivers")}
                    className="px-6 py-2 text-[#3565E3] border border-[#3565E3] rounded-xl hover:bg-blue-50 transition"
                >
                    ← Back to Drivers
                </button>

                </div>


            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map((r, idx) => (
                        <div key={idx} className="bg-white shadow-md p-6 rounded-xl">
                            <img
                                src={r.reviewerPhoto || "https://via.placeholder.com/80"}
                                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                                alt=""
                            />

                            <h3 className="text-center font-semibold text-lg">{r.reviewerName}</h3>

                            <div className="flex justify-center items-center gap-2 mt-1">
                                <p className="font-medium text-sm">{r.rating} / 5.0</p>

                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={
                                                i < Math.round(r.rating)
                                                    ? "text-yellow-400 text-xl"
                                                    : "text-gray-300 text-xl"
                                            }
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-[#333] text-sm mt-3 text-center">{r.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-lg col-span-full text-center">
                        No reviews found for this driver
                    </p>
                )}
            </div>


        </div>
    );
};

export default Reviews;
