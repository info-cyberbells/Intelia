import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/userSlice/userSlice"
import ownerReducer from '../features/ownerSlice/ownerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        owner: ownerReducer,
    }
})

export default store;