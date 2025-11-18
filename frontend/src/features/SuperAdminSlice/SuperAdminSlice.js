import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteOwnerService, addDriverService, addSuperAdminOwnerService, getSingleOwnerService, getDriverReviewsService, updateSuperAdminOwnerService, getSingleDriverService, updateSuperAdminDriverService, fetchSuperAdminJobsService, searchDriverByLicenseServiceInSuperadmin, updateSuperAdminProfile, getMyProfileSuperAdminService, changePasswordSuperAdmin } from "../../auth/authServices";

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

//fetch driver thunk
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


//serach driving license
export const searchDriverByLicenseSuperadmin = createAsyncThunk(
    "owner/searchDriverByLicense",
    async (licenseNumber, { rejectWithValue }) => {
        try {
            const res = await searchDriverByLicenseServiceInSuperadmin(licenseNumber);
            return res;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Driver not found"
            );
        }
    }
);


// change Password SuperAdmin
export const changeSuperAdminPassword = createAsyncThunk(
    "superAdmin/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const data = await changePasswordSuperAdmin(passwordData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to change password"
            );
        }
    }
);

// get profile SuperAdmin
export const fetchSuperAdminProfile = createAsyncThunk(
    "superAdmin/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getMyProfileSuperAdminService();
            return data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);


// Update SuperAdmin profile thunk
export const updateSuperAdminDetails = createAsyncThunk(
    "superAdmin/updateProfile",
    async (updatedData, { rejectWithValue }) => {
        try {
            const data = await updateSuperAdminProfile(updatedData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
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


            //search kicense builder in superadmin
            .addCase(searchDriverByLicenseSuperadmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchDriverByLicenseSuperadmin.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResult = action.payload?.drivers || [];
            })
            .addCase(searchDriverByLicenseSuperadmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.searchResult = [];
            })


            //change super AdminPassword
            .addCase(changeSuperAdminPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeSuperAdminPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(changeSuperAdminPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get superAdmin profile
            .addCase(fetchSuperAdminProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperAdminProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchSuperAdminProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //update superAdmin profile details
            .addCase(updateSuperAdminDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSuperAdminDetails.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.user) {
                    state.profile = action.payload.user;
                }
            })
            .addCase(updateSuperAdminDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })





    }
});

export const { resetDeleteState } = SuperAdminSlice.actions;

export default SuperAdminSlice.reducer;
