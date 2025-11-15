import axios from "axios";
import USER_ENDPOINTS from "./authRoutes";


const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        withCredentials: true,
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
};

//Login driver / car owner
export const loginService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.LOGIN_TO_APP, userData, {
        withCredentials: true,
    });
    return response.data;
};

//logout
export const logoutService = async () => {
    const response = await axios.post(USER_ENDPOINTS.LOGOUT, {}, getAuthHeader());
    return response.data;
};

//register owner
export const RegisterService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.CREATE_OWNER, userData, {
        withCredentials: true,
    });
    return response.data;
};

//register driver
export const registerDriverService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.CREATE_DRIVER, userData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}


// Driver listing for SuperAdmin
export const superAdminDriverListingService = async (search = "", status = "", page = 1, limit = 10) => {
    let url = `${USER_ENDPOINTS.SUPER_ADMIN_GET_DRIVERS}?page=${page}&limit=${limit}`;

    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;

    const response = await axios.get(url, getAuthHeader());
    return response.data;

};


// Owner listing for SuperAdmin
export const superAdminOwnerListingService = async (search = "", status = "", page = 1, limit = 10) => {
    let url = `${USER_ENDPOINTS.SUPER_ADMIN_GET_OWNERS}?page=${page}&limit=${limit}`;

    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;

    const response = await axios.get(url, getAuthHeader());
    return response.data;

};

//deleet driver in bulk
export const deleteDriversService = async (ids) => {
    const response = await axios.delete(
        USER_ENDPOINTS.SUPER_ADMIN_DELETE_DRIVERS,
        {
            data: { ids },
            ...getAuthHeader()
        }
    );

    return response.data;
};

//update  driver status approve or reject
export const updateDriverStatusService = async (driverId, action) => {
    const response = await axios.patch(
        `${USER_ENDPOINTS.SUPER_ADMIN_UPDATE_DRIVER_STATUS}/${driverId}`,
        { action },
        getAuthHeader()
    );

    return response.data;
};

//delete owner
export const deleteOwnerService = async (ownerId) => {
    const response = await axios.delete(
        `${USER_ENDPOINTS.SUPER_ADMIN_DELETE_OWNER}/${ownerId}`,
        getAuthHeader()
    );

    return response.data;
};

//add driver
export const addDriverService = async (formData) => {
    const response = await axios.post(
        USER_ENDPOINTS.SUPER_ADMIN_ADD_DRIVER,
        formData,
        getAuthHeader()
    );

    return response.data;
};

//get client
export const addSuperAdminOwnerService = async (data) => {
    const res = await axios.post(
        USER_ENDPOINTS.SUPER_ADMIN_CLIENTS,
        data,
        getAuthHeader()
    );
    return res.data;
};


// Get single owner by ID
export const getSingleOwnerService = async (ownerId) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.GET_SINGLE_CIENT_DATA}/${ownerId}`,
        getAuthHeader()
    );
    return response.data;
};

// Update owner
export const updateSuperAdminOwnerService = async (ownerId, data) => {
    const response = await axios.put(
        `${USER_ENDPOINTS.UPDATE_CLIENT}/${ownerId}`,
        data,
        getAuthHeader()
    );
    return response.data;
};

//get single driver
export const getSingleDriverService = async (driverId) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.GET_SINGLE_DRIVER}/${driverId}`,
        getAuthHeader()
    );
    return response.data;
};

//update single driver
export const updateSuperAdminDriverService = async (driverId, formData) => {
    const response = await axios.put(
        `${USER_ENDPOINTS.UPDATE_DRIVER}/${driverId}`,
        formData,
        getAuthHeader()
    );
    return response.data;
};

//get driver reviews superadmin
export const getDriverReviewsService = async (driverId) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.DRIVER_REVIEWS}/${driverId}`,
        getAuthHeader()
    );
    return response.data;
};

//get  all jobs in superadmin
export const fetchSuperAdminJobsService = async () => {
    const response = await axios.get(
        USER_ENDPOINTS.SUPERADMIN_JOBS,
        getAuthHeader()
    );
    return response.data;
};






















//owner dashboard owner side
export const ownerDashboardService = async () => {
    const response = await axios.get(USER_ENDPOINTS.OWNER_DASHBOARD, getAuthHeader());
    return response.data;
};

//driver listing in owner side
export const driverListingService = async (page = 1, limit = 10) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.GET_ALL_DRIVERS}?page=${page}&limit=${limit}`,
        getAuthHeader()
    );
    return response.data;
}


//get driver reviews ownerside
export const getDriverReviewsOwnerService = async (driverId) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.DRIVER_REVIEWS_ON_OWNER}/${driverId}`,
        getAuthHeader()
    );
    return response.data;
};

//post driver review
export const postDriverReviewService = async (formData) => {
    const response = await axios.post(
        USER_ENDPOINTS.POST_DRIVER_REVIEW,
        formData,
        getAuthHeader()
    );
    return response.data;
};


//search  driving license
export const searchDriverByLicenseService = async (licenseNumber) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.SEARCH_DRIVER}?licenseNumber=${licenseNumber}`,
        getAuthHeader()
    );
    return response.data;
};

// Get owner notifications
export const getOwnerNotificationsService = async () => {
    const response = await axios.get(
        `${USER_ENDPOINTS.OWNER_NOTIFICATIONS}`,
        getAuthHeader()
    );
    return response.data;
};

//get owners vehicles
export const fetchOwnerVehiclesService = async () => {
    const response = await axios.get(
        `${USER_ENDPOINTS.FETCH_OWNER_VEHICLES}`,
        getAuthHeader()
    );
    return response.data;
};

//add a new vehicle in owner
export const addOwnerVehicleService = async (formData) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeader().headers
        }
    };

    const response = await axios.post(
        USER_ENDPOINTS.ADD_VEHICLE,
        formData,
        config
    );

    return response.data;
};


// Update existing vehicle
export const updateOwnerVehicleService = async ({ formData, vehicleId }) => {
    const response = await axios.put(
        `${USER_ENDPOINTS.UPDATE_VEHICLE}/${vehicleId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                ...getAuthHeader().headers
            }
        }
    );
    return response.data;
};


// Delete vehicle
export const deleteOwnerVehicleService = async (vehicleId) => {
    const response = await axios.delete(
        `${USER_ENDPOINTS.DELETE_VEHICLE}/${vehicleId}`,
        {
            headers: {
                ...getAuthHeader().headers
            }
        }
    );
    return response.data;
};
























//jobs listing in driver side
export const jobsListingService = async (filters = {}) => {
    const {
        page = 1,
        limit = 10,
        city,
        minSalary,
        maxSalary,
        keyword,
    } = filters;

    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (city) params.append("city", city);
    if (minSalary) params.append("minSalary", minSalary);
    if (maxSalary) params.append("maxSalary", maxSalary);
    if (keyword) params.append("keyword", keyword);

    const response = await axios.get(
        `${USER_ENDPOINTS.GET_ALL_JOBS}?${params.toString()}`,
        getAuthHeader()
    );
    return response.data;
};


//get my profile driver side
export const getMyProfileService = async () => {
    const response = await axios.get(USER_ENDPOINTS.MY_PROFILE, getAuthHeader());
    return response.data;
};


// Update driver profile driver side
export const updateDriverProfileService = async (updatedData) => {
    const response = await axios.put(
        USER_ENDPOINTS.UPDATE_MY_PROFILE,
        updatedData,
        getAuthHeader()
    );
    return response.data;
};

//change password driver
export const changePasswordService = async (passwordData) => {
    const response = await axios.put(
        USER_ENDPOINTS.CHANGE_PASSWORD,
        passwordData,
        getAuthHeader()
    );
    return response.data;
};



//get current settings driver
export const getDriverSettingService = async () => {
    const response = await axios.get(USER_ENDPOINTS.SETTINGS, getAuthHeader());
    return response.data;
};

// Update driver settings
export const updateDriverSettingsService = async (settingsData) => {
    const response = await axios.post(
        `${USER_ENDPOINTS.UPDATE_SETTINGS}`,
        settingsData,
        getAuthHeader()
    );
    return response.data;
};

// Post driver feedback
export const postDriverFeedbackService = async (feedbackData) => {
    const response = await axios.post(
        `${USER_ENDPOINTS.POST_FEEDBACK}`,
        feedbackData,
        getAuthHeader()
    );
    return response.data;
};

//get my job applications
export const getMyJobApplicationsService = async () => {
    const response = await axios.get(USER_ENDPOINTS.MY_JOB_APPLICATIONS, getAuthHeader());
    return response.data;
};

// Get driver notifications
export const getDriverNotificationsService = async () => {
    const response = await axios.get(
        `${USER_ENDPOINTS.MY_NOTIFICATIONS}`,
        getAuthHeader()
    );
    return response.data;
};

// Get driver resume
export const getMyResumeService = async () => {
    const response = await axios.get(
        `${USER_ENDPOINTS.GET_MY_RESUME}`,
        getAuthHeader()
    );
    return response.data;
};

// Get Route Types for driver (Master Data)
export const getRouteTypesService = async () => {
    const response = await axios.get(`${USER_ENDPOINTS.ROUTE_TYPES}`, getAuthHeader());
    return response.data;
};


// GET Vehicle Types
export const getVehicleTypesService = async () => {
    const response = await axios.get(
        USER_ENDPOINTS.VEHICLE_TYPES,
        getAuthHeader()
    );
    return response.data;
};


//get driver skills
export const getSkillsService = async () => {
    const response = await axios.get(`${USER_ENDPOINTS.SKILLS}`,
        getAuthHeader()
    );
    return response.data;
};


//post driver resume details
export const postDriverResumeService = async (resumeData) => {
    const authHeader = getAuthHeader();

    const response = await axios.post(
        USER_ENDPOINTS.POST_RESUME,
        resumeData,
        {
            ...authHeader,
            headers: {
                ...authHeader.headers,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


//get my reviews 
export const getMyReviewsService = async (driverId) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.FETCH_MY_REVIEWS}`,
        getAuthHeader()
    );
    return response.data;
};



// Save job (POST { jobId })
export const driverSaveJobService = async (jobId) => {
    const payload = { jobId };
    const response = await axios.post(
        USER_ENDPOINTS.DRIVER_SAVE_JOB,
        payload,
        getAuthHeader()
    );
    return response.data;
};

// Apply job (POST to /apply/:jobId with { driverId })
export const driverApplyJobService = async (jobId, driverId) => {
    const payload = { driverId };
    const response = await axios.post(
        `${USER_ENDPOINTS.DRIVER_APPLY_JOB}/${jobId}`,
        payload,
        getAuthHeader()
    );
    return response.data;
};
