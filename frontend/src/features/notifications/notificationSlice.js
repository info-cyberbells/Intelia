import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDriverNotificationsService, getOwnerNotificationsService } from "../../auth/authServices";

// Fetch driver notifications
export const fetchDriverNotifications = createAsyncThunk(
    "notifications/fetchDriverNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getDriverNotificationsService();
            return data.notifications || [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch notifications"
            );
        }
    }
);

// Fetch Owner notifications
export const fetchOwnerNotifications = createAsyncThunk(
    "notifications/fetchOwnerNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getOwnerNotificationsService();
            return data.notifications || [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch notifications"
            );
        }
    }
);


const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        loading: false,
        data: [],
        error: null,
    },
    reducers: {
        clearNotifications: (state) => {
            state.data = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchDriverNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDriverNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDriverNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch owner notifications
            .addCase(fetchOwnerNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOwnerNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchOwnerNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;