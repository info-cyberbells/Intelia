import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/userSlice/userSlice"
import ownerReducer from '../features/ownerSlice/ownerSlice';
import driverReducer from "../features/Drivers/driverSlice";
import jobsReducer from "../features/Jobs/JobsSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        owner: ownerReducer,
        drivers: driverReducer,
        jobs: jobsReducer,
    }
})

export default store;