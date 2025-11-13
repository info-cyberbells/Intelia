import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDriverNotificationsService } from "../../auth/authServices";

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
            });
    },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;