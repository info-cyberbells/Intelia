import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ownerDashboardService, superAdminOwnerListingService, searchDriverByLicenseService, fetchOwnerVehiclesService, addOwnerVehicleService, updateOwnerVehicleService, deleteOwnerVehicleService, createJobService, fetchOwnerJobsService, fetchSingleJobService, updateJobService, deleteJobService, fetchJobApplicationsService, fetchDriverProfileService, shortlistApplicantService, updateOwnerDetails, getMyProfileOwnerService, changePasswordOwner } from '../../auth/authServices';

// get all drivers - SuperAdmin
export const fetchSuperAdminOwners = createAsyncThunk(
    "drivers/fetchSuperAdminOwners",
    async ({ search = "", status = "", page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const data = await superAdminOwnerListingService(search, status, page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch drivers (SuperAdmin)"
            );
        }
    }
);


// dashboard thunk data
export const fetchOwnerDashboard = createAsyncThunk(
    'owner/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ownerDashboardService();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch dashboard data'
            );
        }
    }
);

//serach driving license
export const searchDriverByLicense = createAsyncThunk(
    "owner/searchDriverByLicense",
    async (licenseNumber, { rejectWithValue }) => {
        try {
            const res = await searchDriverByLicenseService(licenseNumber);
            return res;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Driver not found"
            );
        }
    }
);

//get my vehicles
export const fetchOwnerVehicles = createAsyncThunk(
    "owner/fetchOwnerVehicles",
    async (_, thunkAPI) => {
        try {
            return await fetchOwnerVehiclesService();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch vehicles"
            );
        }
    }
);

///add owner vehicle
export const addOwnerVehicle = createAsyncThunk(
    "owner/addOwnerVehicle",
    async (formData, { rejectWithValue }) => {
        try {
            return await addOwnerVehicleService(formData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add vehicle"
            );
        }
    }
);


// UPDATE VEHICLE
export const updateOwnerVehicle = createAsyncThunk(
    "owner/updateOwnerVehicle",
    async ({ formData, vehicleId }, { rejectWithValue }) => {
        try {
            const res = await updateOwnerVehicleService({ formData, vehicleId });
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);


// DELETE VEHICLE
export const deleteOwnerVehicle = createAsyncThunk(
    "owner/deleteOwnerVehicle",
    async (vehicleId, { rejectWithValue }) => {
        try {
            const res = await deleteOwnerVehicleService(vehicleId);
            return { ...res, vehicleId };
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);



// Create Job owner
export const createJob = createAsyncThunk(
    "jobs/createJob",
    async (jobData, thunkAPI) => {
        try {
            return await createJobService(jobData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create job"
            );
        }
    }
);

//fetch owner jobs
export const fetchOwnerJobs = createAsyncThunk(
    "owner/fetchOwnerJobs",
    async (_, thunkAPI) => {
        try {
            return await fetchOwnerJobsService();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch owner jobs"
            );
        }
    }
);


// Fetch single job
export const fetchSingleJob = createAsyncThunk(
    "owner/fetchSingleJob",
    async (jobId, { rejectWithValue }) => {
        try {
            return await fetchSingleJobService(jobId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch job details"
            );
        }
    }
);

// Update job
export const updateJob = createAsyncThunk(
    "owner/updateJob",
    async ({ jobId, jobData }, { rejectWithValue }) => {
        try {
            return await updateJobService(jobId, jobData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update job"
            );
        }
    }
);

// Delete job
export const deleteJob = createAsyncThunk(
    "owner/deleteJob",
    async (jobId, { rejectWithValue }) => {
        try {
            const res = await deleteJobService(jobId);
            return { ...res, jobId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete job"
            );
        }
    }
)


// fetch job applications thunk
export const fetchJobApplications = createAsyncThunk(
    "owner/fetchJobApplications",
    async (jobId, { rejectWithValue }) => {
        try {
            return await fetchJobApplicationsService(jobId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch job applications"
            );
        }
    }
)


// Update thunk
export const fetchDriverProfile = createAsyncThunk(
    "owner/fetchDriverProfile",
    async (driverId, { rejectWithValue }) => {
        try {
            return await fetchDriverProfileService(driverId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch driver profile"
            );
        }
    }
);

// shortlist thunk 
export const shortlistApplicant = createAsyncThunk(
    "owner/shortlistApplicant",
    async ({ jobId, applicantId }, { rejectWithValue }) => {
        try {
            return await shortlistApplicantService({ jobId, applicantId });
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to shortlist applicant"
            );
        }
    }
);

// change Password Owner
export const changeOwnerPassword = createAsyncThunk(
    "owner/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const data = await changePasswordOwner(passwordData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to change password"
            );
        }
    }
);

// get profile owner
export const fetchOwnerProfile = createAsyncThunk(
    "owner/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getMyProfileOwnerService();
            return data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);


// Update owner profile thunk
export const updateOwnerProfileDetails = createAsyncThunk(
    "owner/updateProfile",
    async (updatedData, { rejectWithValue }) => {
        try {
            const data = await updateOwnerDetails(updatedData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
);

const initialState = {
    dashboardData: null,
    loading: false,
    error: null,
    searchResult: [],
    vehicles: [],
    ownerJobs: [],
    currentJob: null,
    jobApplications: null,
    driverProfile: null,


};

const ownerSlice = createSlice({
    name: 'owner',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            //  get all owners - SuperAdmin
            .addCase(fetchSuperAdminOwners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperAdminOwners.fulfilled, (state, action) => {
                state.loading = false;

                const { data, pagination } = action.payload || {};

                state.data = data || [];
                state.totalPages = pagination?.pages || 0;
                state.currentPage = pagination?.page || 1;
                state.totalDrivers = pagination?.total || data?.length || 0;
            })

            .addCase(fetchSuperAdminOwners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //dashboard builder
            .addCase(fetchOwnerDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
            })
            .addCase(fetchOwnerDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //search kicense builder
            .addCase(searchDriverByLicense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchDriverByLicense.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResult = action.payload?.drivers || [];
            })
            .addCase(searchDriverByLicense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.searchResult = [];
            })

            //get veicle detials
            .addCase(fetchOwnerVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchOwnerVehicles.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload.data;
            })

            .addCase(fetchOwnerVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //add a vehicle in owner side
            .addCase(addOwnerVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addOwnerVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles.push(action.payload.data);
            })
            .addCase(addOwnerVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // UPDATE VEHICLE
            .addCase(updateOwnerVehicle.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOwnerVehicle.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data;
                state.vehicles = state.vehicles.map(v =>
                    v._id === updated._id ? updated : v
                );
            })
            .addCase(updateOwnerVehicle.rejected, (state) => {
                state.loading = false;
            })

            // DELETE VEHICLE
            .addCase(deleteOwnerVehicle.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOwnerVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = state.vehicles.filter(v => v._id !== action.payload.vehicleId);
            })
            .addCase(deleteOwnerVehicle.rejected, (state) => {
                state.loading = false;
            })

            //create job builder
            .addCase(createJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.error = action.payload;
            })

            //fetch owner jobs
            .addCase(fetchOwnerJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOwnerJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.ownerJobs = action.payload.data;
            })
            .addCase(fetchOwnerJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })



            // Fetch single job
            .addCase(fetchSingleJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSingleJob.fulfilled, (state, action) => {
                state.loading = false;
                state.currentJob = action.payload.data;
            })
            .addCase(fetchSingleJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update job
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data;
                state.ownerJobs = state.ownerJobs.map(job =>
                    job._id === updated._id ? updated : job
                );
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete job
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                state.ownerJobs = state.ownerJobs.filter(
                    job => job._id !== action.payload.jobId
                );
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch job applications
            .addCase(fetchJobApplications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.jobApplications = action.payload;
            })
            .addCase(fetchJobApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch driver profile
            .addCase(fetchDriverProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDriverProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.driverProfile = action.payload.data || action.payload;
            })
            .addCase(fetchDriverProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Shortlist builder
            .addCase(shortlistApplicant.pending, (state) => {
                state.loading = true;
            })
            .addCase(shortlistApplicant.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(shortlistApplicant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //change owner Password
            .addCase(changeOwnerPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeOwnerPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(changeOwnerPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get owner profile
            .addCase(fetchOwnerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOwnerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchOwnerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //update owner profile details
            .addCase(updateOwnerProfileDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOwnerProfileDetails.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.user) {
                    state.profile = action.payload.user;
                }
            })
            .addCase(updateOwnerProfileDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
});

export const { clearError } = ownerSlice.actions;
export default ownerSlice.reducer;