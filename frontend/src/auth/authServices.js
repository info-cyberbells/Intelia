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
