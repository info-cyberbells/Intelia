import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteOwnerService, addDriverService, addSuperAdminOwnerService, getSingleOwnerService, getDriverReviewsService, updateSuperAdminOwnerService, getSingleDriverService, updateSuperAdminDriverService, fetchSuperAdminJobsService } from "../../auth/authServices";

// Thunk: Delete Owner
export const deleteOwner = createAsyncThunk(
    "deleteOwner/deleteOwner",
    async (ownerId, { rejectWithValue }) => {
        try {
            await deleteOwnerService(ownerId);
            return ownerId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete owner"
            );
        }
    }
);

// add driver
export const addSuperAdminDriver = createAsyncThunk(
    "drivers/addSuperAdminDriver",
    async (formData, { rejectWithValue }) => {
        try {
            const data = await addDriverService(formData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add driver"
            );
        }
    }
);

//add owner 
export const addSuperAdminOwner = createAsyncThunk(
    "superAdmin/addOwner",
    async (formData, thunkAPI) => {
        try {
            return await addSuperAdminOwnerService(formData);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed");
        }
    }
);

// Get single owner
export const getSingleOwner = createAsyncThunk(
    "superAdmin/getSingleOwner",
    async (ownerId, thunkAPI) => {
        try {
            return await getSingleOwnerService(ownerId);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch owner");
        }
    }
);

// Update owner
export const updateSuperAdminOwner = createAsyncThunk(
    "superAdmin/updateOwner",
    async ({ id, formData }, thunkAPI) => {
        try {
            return await updateSuperAdminOwnerService(id, formData);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update");
        }
    }
);

export const getSingleDriver = createAsyncThunk(
    "superAdmin/getSingleDriver",
    async (driverId, thunkAPI) => {
        try {
            return await getSingleDriverService(driverId);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch driver");
        }
    }
);

export const updateSuperAdminDriver = createAsyncThunk(
    "superAdmin/updateDriver",
    async ({ id, formData }, thunkAPI) => {
        try {
            return await updateSuperAdminDriverService(id, formData);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update driver");
        }
    }
);

///fetch driver thunk
export const fetchDriverReviews = createAsyncThunk(
    "drivers/fetchDriverReviews",
    async (driverId, { rejectWithValue }) => {
        try {
            const data = await getDriverReviewsService(driverId);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch driver reviews"
            );
        }
    }
);

//get  all jobs in suepradmin
export const fetchSuperAdminJobs = createAsyncThunk(
    "jobs/fetchSuperAdminJobs",
    async (_, thunkAPI) => {
        try {
            return await fetchSuperAdminJobsService();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load jobs"
            );
        }
    }
);



const SuperAdminSlice = createSlice({
    name: "superAdmin",
    initialState: {
        loading: false,
        error: null,
        success: false,
        deletedId: null,
        currentOwner: null,
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        jobs: [],
    },

    reducers: {
        resetDeleteState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.deletedId = null;
        }
    },

    extraReducers: (builder) => {
        builder
            //delete owner builder
            .addCase(deleteOwner.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })

            .addCase(deleteOwner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.deletedId = action.payload;
            })

            .addCase(deleteOwner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            //create driver buider
            .addCase(addSuperAdminDriver.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSuperAdminDriver.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addSuperAdminDriver.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //owner adding builder
            .addCase(addSuperAdminOwner.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSuperAdminOwner.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addSuperAdminOwner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //get single owner builder
            .addCase(getSingleOwner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleOwner.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOwner = action.payload;
            })
            .addCase(getSingleOwner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //owner updating builder
            .addCase(updateSuperAdminOwner.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSuperAdminOwner.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateSuperAdminOwner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //get single driver
            .addCase(getSingleDriver.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleDriver.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDriver = action.payload;
            })
            .addCase(getSingleDriver.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //update single driver detials
            .addCase(updateSuperAdminDriver.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSuperAdminDriver.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateSuperAdminDriver.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //driver  reviews
            .addCase(fetchDriverReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchDriverReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews || [];
                state.averageRating = action.payload.averageRating || 0;
                state.totalReviews = action.payload.totalReviews || 0;
            })

            .addCase(fetchDriverReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //get all jobs in superadmin
            .addCase(fetchSuperAdminJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperAdminJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.jobs;
            })
            .addCase(fetchSuperAdminJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })



    }
});

export const { resetDeleteState } = SuperAdminSlice.actions;

export default SuperAdminSlice.reducer;
