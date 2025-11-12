import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { driverListingService, superAdminDriverListingService, getMyProfileService, updateDriverProfileService, changePasswordService, getDriverSettingService, updateDriverSettingsService, postDriverFeedbackService } from "../../auth/authServices";


// get all drivers - SuperAdmin
export const fetchSuperAdminDrivers = createAsyncThunk(
    "drivers/fetchSuperAdminDrivers",
    async ({ search = "", status = "", page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await superAdminDriverListingService(search, status, page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch drivers (SuperAdmin)"
            );
        }
    }
);


//get all drivers  owner
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


//get my profile Data  driverside
export const fetchDriverProfile = createAsyncThunk(
    "drivers/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getMyProfileService();
            return data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);


// Update driver profile thunk
export const updateDriverProfile = createAsyncThunk(
    "drivers/updateProfile",
    async (updatedData, { rejectWithValue }) => {
        try {
            const data = await updateDriverProfileService(updatedData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
);


//change driver password
export const changeDriverPassword = createAsyncThunk(
    "drivers/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const data = await changePasswordService(passwordData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to change password"
            );
        }
    }
);


// Get driver settings
export const fetchDriverSettings = createAsyncThunk(
    "drivers/fetchSettings",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getDriverSettingService();
            return data.settings || data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch settings"
            );
        }
    }
);


// Update driver settings
export const updateDriverSettings = createAsyncThunk(
    "drivers/updateSettings",
    async (settingsData, { rejectWithValue }) => {
        try {
            const data = await updateDriverSettingsService(settingsData);
            return data.settings || data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update settings"
            );
        }
    }
);

// Post driver feedback
export const postDriverFeedback = createAsyncThunk(
    "drivers/postFeedback",
    async (feedbackData, { rejectWithValue }) => {
        try {
            const data = await postDriverFeedbackService(feedbackData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to submit feedback"
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
        profile: null,
        settings: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            //  get all drivers - SuperAdmin
            .addCase(fetchSuperAdminDrivers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperAdminDrivers.fulfilled, (state, action) => {
                state.loading = false;

                const { data, pagination } = action.payload || {};

                state.data = data || [];
                state.totalPages = pagination?.pages || 0;
                state.currentPage = pagination?.page || 1;
                state.totalDrivers = pagination?.total || data?.length || 0;
            })

            .addCase(fetchSuperAdminDrivers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //get all drivers builder owner
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
            })

            // get driver profile
            .addCase(fetchDriverProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDriverProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchDriverProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //update profile details
            .addCase(updateDriverProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDriverProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.user) {
                    state.profile = action.payload.user;
                }
            })
            .addCase(updateDriverProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Change password builder
            .addCase(changeDriverPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeDriverPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(changeDriverPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //  Fetch driver settings
            .addCase(fetchDriverSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDriverSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(fetchDriverSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //update driver profile details
            .addCase(updateDriverSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDriverSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(updateDriverSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //post driver feedback
            .addCase(postDriverFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postDriverFeedback.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(postDriverFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });



    },
});

export default driverSlice.reducer;