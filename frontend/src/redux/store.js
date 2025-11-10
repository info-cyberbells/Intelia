import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/userSlice/userSlice"
import ownerReducer from '../features/ownerSlice/ownerSlice';
import driverReducer from "../features/Drivers/driverSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        owner: ownerReducer,
        drivers: driverReducer,
    }
})

export default store;