import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jobsListingService } from "../../auth/authServices";

//get all jobs
export const fetchAllJobs = createAsyncThunk(
    "jobs/fetchJobs",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await jobsListingService(page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch Jobs"
            );
        }
    }
);


const JobsSlice = createSlice({
    name: "jobs",
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
            //get all jobs builder
            .addCase(fetchAllJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.jobs || [];
                state.totalPages = action.payload?.totalPages || 0;
                state.currentPage = action.payload?.currentPage || 1;

            })
            .addCase(fetchAllJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default jobsSlice.reducer;