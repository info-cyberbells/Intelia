import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRouteTypesService, getVehicleTypesService, getSkillsService } from "../../auth/authServices";

// Fetch route types
export const fetchRouteTypes = createAsyncThunk(
    "masterData/fetchRouteTypes",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getRouteTypesService();
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch route types"
            );
        }
    }
);

// Fetch vehicle types
export const fetchVehicleTypes = createAsyncThunk(
    "masterData/fetchVehicleTypes",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getVehicleTypesService();
            return data.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch vehicle types");
        }
    }
);

// Fetch Skills List
export const fetchSkills = createAsyncThunk(
    "masterData/fetchSkills",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getSkillsService();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load skills");
        }
    }
);

const masterDataSlice = createSlice({
    name: "masterData",
    initialState: {
        loading: false,
        routeTypes: [],
        vehicleTypes: [],
        skills: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Route Types
            .addCase(fetchRouteTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRouteTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.routeTypes = action.payload || [];
            })
            .addCase(fetchRouteTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Vehicle Types
            .addCase(fetchVehicleTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicleTypes = action.payload || [];
            })
            .addCase(fetchVehicleTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Skills
            .addCase(fetchSkills.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = action.payload || [];
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default masterDataSlice.reducer;