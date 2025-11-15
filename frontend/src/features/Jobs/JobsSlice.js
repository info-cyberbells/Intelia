import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jobsListingService, driverSaveJobService, driverApplyJobService, driverWithdrawJobService } from "../../auth/authServices";

//get all jobs
export const fetchAllJobs = createAsyncThunk(
    "jobs/fetchJobs",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const data = await jobsListingService(filters);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch Jobs"
            );
        }
    }
);


// SAVE JOB thunk
export const saveJob = createAsyncThunk(
    "jobs/saveJob",
    async ({ jobId }, { rejectWithValue }) => {
        try {
            const data = await driverSaveJobService(jobId);
            return { jobId, data }; // return jobId so reducer can mark as saved
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to save job");
        }
    }
);

// APPLY JOB thunk
export const applyJob = createAsyncThunk(
    "jobs/applyJob",
    async ({ jobId, driverId }, { rejectWithValue }) => {
        try {
            const data = await driverApplyJobService(jobId, driverId);
            return { jobId, data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to apply for job");
        }
    }
);


// withdraw job thunk
export const withdrawJob = createAsyncThunk(
    "jobs/withdrawJob",
    async ({ jobId, driverId }, { rejectWithValue }) => {
        try {
            const data = await driverWithdrawJobService(jobId, driverId);
            return { jobId, data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to withdraw application");
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
        totalJobs: 0,
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
                state.totalJobs = action.payload?.totalJobs || 0;

            })
            .addCase(fetchAllJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //save job builder
            .addCase(saveJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveJob.fulfilled, (state, action) => {
                state.loading = false;
                const { jobId } = action.payload;
                state.data = state.data.map(job =>
                    job._id === jobId ? { ...job, isSaved: true } : job
                );
            })
            .addCase(saveJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //apply job builder
            .addCase(applyJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyJob.fulfilled, (state, action) => {
                state.loading = false;
                const { jobId } = action.payload;
                // mark job as applied in state.data if present
                state.data = state.data.map(job =>
                    job._id === jobId ? { ...job, alreadyApplied: true } : job
                );
            })
            .addCase(applyJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //withdarw job
            .addCase(withdrawJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawJob.fulfilled, (state, action) => {
                state.loading = false;
                const { jobId } = action.payload;
                state.data = state.data.map(job =>
                    job._id === jobId
                        ? { ...job, alreadyApplied: false, applicationStatus: "withdrawn" } : job
                );
            })
            .addCase(withdrawJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default JobsSlice.reducer;
