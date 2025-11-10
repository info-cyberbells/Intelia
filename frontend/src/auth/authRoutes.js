export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
    LOGIN_TO_APP: `${API_BASE_URL}/auth/login`,
    CREATE_OWNER: `${API_BASE_URL}/auth/create-owner`,
    CREATE_DRIVER: `${API_BASE_URL}/auth/register`,

    OWNER_DASHBOARD: `${API_BASE_URL}/owner/dashboard`,
    GET_ALL_DRIVERS: `${API_BASE_URL}/owner/drivers`,



    UPDATE_MY_PROFILE: `${API_BASE_URL}/driver/profile`,
    MY_PROFILE: `${API_BASE_URL}/driver/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/driver/change-password`,
    GET_ALL_JOBS: `${API_BASE_URL}/driver/jobs`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,

}
export default USER_ENDPOINTS;