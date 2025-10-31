export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
    LOGIN_TO_APP: `${API_BASE_URL}/auth/login`,
    CREATE_OWNER: `${API_BASE_URL}/auth/create-owner`,
    CREATE_DRIVER: `${API_BASE_URL}/auth/register`,

}
export default USER_ENDPOINTS;