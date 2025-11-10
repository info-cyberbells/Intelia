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
    });
    return response.data;
}


//owner dashboard
export const ownerDashboardService = async () => {
    const response = await axios.get(USER_ENDPOINTS.OWNER_DASHBOARD, getAuthHeader());
    return response.data;
};

//driver listing
export const driverListingService = async (page = 1, limit = 10) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.GET_ALL_DRIVERS}?page=${page}&limit=${limit}`,
        getAuthHeader()
    );
    return response.data;
}