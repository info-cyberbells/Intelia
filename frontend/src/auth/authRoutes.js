export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
  LOGIN_TO_APP: `${API_BASE_URL}/auth/login`,
  CREATE_OWNER: `${API_BASE_URL}/auth/create-owner`,
  CREATE_DRIVER: `${API_BASE_URL}/auth/register`,

  SUPER_ADMIN_GET_DRIVERS: `${API_BASE_URL}/superAdmin/drivers`,
  SUPER_ADMIN_GET_OWNERS: `${API_BASE_URL}/superAdmin/clients`,
  SUPER_ADMIN_DELETE_DRIVERS: `${API_BASE_URL}/superAdmin/drivers/delete`,
  SUPER_ADMIN_UPDATE_DRIVER_STATUS: `${API_BASE_URL}/superAdmin/drivers/status`,
  SUPER_ADMIN_DELETE_OWNER: `${API_BASE_URL}/superAdmin/clients`,
  SUPER_ADMIN_ADD_DRIVER: `${API_BASE_URL}/superAdmin/drivers`,
  SUPER_ADMIN_CLIENTS: `${API_BASE_URL}/superAdmin/clients`,
  UPDATE_CLIENT: `${API_BASE_URL}/superAdmin/clients`,
  GET_SINGLE_CIENT_DATA: `${API_BASE_URL}/superAdmin/clients`,
  GET_SINGLE_DRIVER: `${API_BASE_URL}/superAdmin/drivers`,
  UPDATE_DRIVER: `${API_BASE_URL}/superAdmin/drivers`,
  DRIVER_REVIEWS: `${API_BASE_URL}/superAdmin/driver-reviews`,
  SUPERADMIN_JOBS: `${API_BASE_URL}/superAdmin/jobs/all`,






  OWNER_DASHBOARD: `${API_BASE_URL}/owner/dashboard`,
  GET_ALL_DRIVERS: `${API_BASE_URL}/owner/drivers`,
  DRIVER_REVIEWS_ON_OWNER: `${API_BASE_URL}/owner/driver-reviews`,
  POST_DRIVER_REVIEW: `${API_BASE_URL}/owner/driver-reviews`,
  SEARCH_DRIVER: `${API_BASE_URL}/owner/driver/search`,
  OWNER_NOTIFICATIONS: `${API_BASE_URL}/owner/my-notifications`,





  UPDATE_MY_PROFILE: `${API_BASE_URL}/driver/profile`,
  MY_PROFILE: `${API_BASE_URL}/driver/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/driver/change-password`,
  GET_ALL_JOBS: `${API_BASE_URL}/driver/jobs`,
  MY_JOB_APPLICATIONS: `${API_BASE_URL}/driver/my-applications`,
  MY_NOTIFICATIONS: `${API_BASE_URL}/driver/my-notifications`,
  GET_MY_RESUME: `${API_BASE_URL}/driver/my-resume`,
  ROUTE_TYPES: `${API_BASE_URL}/master/route-types`,
  VEHICLE_TYPES: `${API_BASE_URL}/master/vehicle-types`,
  SKILLS: `${API_BASE_URL}/master/skills`,
  POST_RESUME: `${API_BASE_URL}/driver/post-resume`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  FETCH_MY_REVIEWS: `${API_BASE_URL}/driver/driver-reviews`,

  SETTINGS: `${API_BASE_URL}/driver/settings`,
  UPDATE_SETTINGS: `${API_BASE_URL}/driver/update-settings`,
  POST_FEEDBACK: `${API_BASE_URL}/driver/post-feedback`


}
export default USER_ENDPOINTS;