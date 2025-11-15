import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOwnerVehicles, deleteOwnerVehicle } from "../../features/ownerSlice/ownerSlice";
import addicon from "/menuicons/add_circle.svg";
import { useToast } from '../../context/ToastContext';
import AddVehicleModal from "../Model/AddVehicleModal";
import DeleteConfirmationModal from '../Model/DeleteConfirmationModal ';




const AddVehicle = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { vehicles, loading } = useSelector((state) => state.owner);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editVehicle, setEditVehicle] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);


    useEffect(() => {
        dispatch(fetchOwnerVehicles());
    }, [dispatch]);

    const handleEdit = (vehicle) => {
        setEditVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleDelete = (vehicle) => {
        setVehicleToDelete(vehicle);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (vehicleToDelete) {
            setIsDeleting(true);
            try {
                await dispatch(deleteOwnerVehicle(vehicleToDelete._id)).unwrap();
                showToast('Vehicle deleted successfully', 'success');
                setIsDeleteModalOpen(false);
                setVehicleToDelete(null);
            } catch (error) {
                console.error("Failed to delete vehicle:", error);
                showToast(error || 'Failed to delete vehicle', 'error');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setVehicleToDelete(null);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditVehicle(null);
    };

    if (loading) {
        return (
            <div className="ml-56 mt-16 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#3565E3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-600">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ml-56 mt-16 font-[Poppins] min-h-screen bg-[#F5F5F7] p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#363B64] mb-2">My Vehicle</h1>
                </div>

                <button onClick={() => { setEditVehicle(null); setIsModalOpen(true); }}
                    className="px-6 py-3 bg-[#3565E3] text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-[#2851c7] transition-colors">
                    Add Vehicle
                    <img src={addicon} alt="" className="w-5 h-5 filter invert brightness-0"
                    />
                </button>
            </div>


            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle._id}
                        className="bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        {/* Card Header */}
                        <div className="p-4 pb-2 relative">
                            <div className="absolute top-2 right-2 flex gap-2">
                                {/* Edit Icon */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(vehicle);
                                    }}
                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 text-[#3565E3]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </button>

                                {/* Delete Icon */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(vehicle);
                                    }}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <h3 className="font-semibold text-base text-[#363B64] leading-tight pr-20">
                                {vehicle.make}
                                <br />
                                <span className="text-sm text-gray-500 font-normal whitespace-nowrap ml-1">
                                    {vehicle.model}
                                </span>

                            </h3>

                            <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-2">
                                <span>{vehicle.color}</span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span>
                                <span>{vehicle.year}</span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span>
                                <span className="capitalize">{vehicle.fuelType}</span>
                            </p>
                        </div>

                        {/* Vehicle Image */}
                        <div className="px-4 pb-3">
                            <div className="rounded-xl overflow-hidden h-32">
                                <img
                                    src={vehicle.vehicleImage}
                                    alt={vehicle.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-4 pb-4 flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4 text-[#3565E3]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span>{vehicle.capacity}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4 text-[#3565E3]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>{vehicle.transmission}</span>
                            </div>

                            <span className="text-gray-500">{vehicle.plateNo}</span>
                        </div>
                    </div>
                ))}
            </div>


            {vehicles?.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-[#3565E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#363B64] mb-3">No Vehicles Found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You haven't added any vehicles yet. Add your first vehicle to start your journey and create job postings.
                    </p>
                    <button
                        onClick={() => { setEditVehicle(null); setIsModalOpen(true); }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#3565E3] text-white font-medium rounded-lg hover:bg-[#2851c7] transition-colors"
                    >
                        <img src={addicon} alt="" className="w-5 h-5 filter invert brightness-0" />
                        Add Your First Vehicle
                    </button>
                </div>
            )}

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editData={editVehicle}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                vehicleName={`${vehicleToDelete?.make} ${vehicleToDelete?.model}`}
            />
        </div>
    );
};

export default AddVehicle;