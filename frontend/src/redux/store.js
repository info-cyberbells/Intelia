import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/userSlice/userSlice"
import ownerReducer from '../features/ownerSlice/ownerSlice';
import driverReducer from "../features/Drivers/driverSlice";
import jobsReducer from "../features/Jobs/JobsSlice";
import SuperAdminReducer from "../features/SuperAdminSlice/SuperAdminSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import masterDataReducer from "../features/masterData/masterDataSlice";




export const store = configureStore({
    reducer: {
        auth: authReducer,
        owner: ownerReducer,
        drivers: driverReducer,
        jobs: jobsReducer,
        SuperAdmin: SuperAdminReducer,
        notifications: notificationReducer,
        masterData: masterDataReducer,

    }
})

export default store;