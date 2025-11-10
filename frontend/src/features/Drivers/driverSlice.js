// src/redux/thunks/driverThunk.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { driverListingService } from "../../auth/authServices";

export const fetchDrivers = createAsyncThunk(
    "drivers/fetchDrivers",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await driverListingService(page, limit);
            return data; // assuming API returns { drivers, totalPages, currentPage, ... }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch drivers"
            );
        }
    }
);


const driverSlice = createSlice({
    name: "drivers",
    initialState: {
        loading: false,
        data: [],
        totalPages: 0,
        currentPage: 1,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchDrivers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDrivers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.drivers || [];
                state.totalPages = action.payload?.totalPages || 0;
                state.currentPage = action.payload?.currentPage || 1;
            })
            .addCase(fetchDrivers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default driverSlice.reducer;