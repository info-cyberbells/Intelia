import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { driverListingService } from "../../auth/authServices";

//get all drivers
export const fetchDrivers = createAsyncThunk(
    "drivers/fetchDrivers",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await driverListingService(page, limit);
            return data;
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
            //get all drivers builder
            .addCase(fetchDrivers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDrivers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.drivers || [];
                state.totalPages = action.payload?.totalPages || 0;
                state.currentPage = action.payload?.currentPage || 1;
                state.totalDrivers = action.payload.totalDrivers || 0;
                state.riskScore = action.payload.riskScore || 0;
                state.lowRisk = action.payload.lowRisk || 0;
                state.totalLicense = action.payload.totalLicense || 0;
            })
            .addCase(fetchDrivers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default driverSlice.reducer;