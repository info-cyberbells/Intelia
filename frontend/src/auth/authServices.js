import axios from "axios";
import USER_ENDPOINTS from "./authRoutes";

//Login driver / car owner
export const loginService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.LOGIN_TO_APP, userData, {
        withCredentials: true,
    });
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
