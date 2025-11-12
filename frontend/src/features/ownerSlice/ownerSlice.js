import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ownerDashboardService, superAdminOwnerListingService } from '../../auth/authServices';

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

const initialState = {
    dashboardData: null,
    loading: false,
    error: null,
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
            });
    },
});

export const { clearError } = ownerSlice.actions;
export default ownerSlice.reducer;