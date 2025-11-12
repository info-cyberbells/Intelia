export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
    LOGIN_TO_APP: `${API_BASE_URL}/auth/login`,
    CREATE_OWNER: `${API_BASE_URL}/auth/create-owner`,
    CREATE_DRIVER: `${API_BASE_URL}/auth/register`,

    SUPER_ADMIN_GET_DRIVERS: `${API_BASE_URL}/superAdmin/drivers`,
    SUPER_ADMIN_GET_OWNERS: `${API_BASE_URL}/superAdmin/clients`,


    OWNER_DASHBOARD: `${API_BASE_URL}/owner/dashboard`,
    GET_ALL_DRIVERS: `${API_BASE_URL}/owner/drivers`,



    UPDATE_MY_PROFILE: `${API_BASE_URL}/driver/profile`,
    MY_PROFILE: `${API_BASE_URL}/driver/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/driver/change-password`,
    GET_ALL_JOBS: `${API_BASE_URL}/driver/jobs`,
    MY_JOB_APPLICATIONS: `${API_BASE_URL}/driver/my-applications`,
    MY_NOTIFICATIONS: `${API_BASE_URL}/driver/my-notifications`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,

    SETTINGS: `${API_BASE_URL}/driver/settings`,
    UPDATE_SETTINGS: `${API_BASE_URL}/driver/update-settings`,
    POST_FEEDBACK: `${API_BASE_URL}/driver/post-feedback`


}
export default USER_ENDPOINTS;