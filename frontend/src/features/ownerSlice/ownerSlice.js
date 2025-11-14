import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ownerDashboardService, superAdminOwnerListingService, searchDriverByLicenseService } from '../../auth/authServices';

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


const initialState = {
    dashboardData: null,
    loading: false,
    error: null,
    searchResult: [],

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
            });

    },
});

export const { clearError } = ownerSlice.actions;
export default ownerSlice.reducer;