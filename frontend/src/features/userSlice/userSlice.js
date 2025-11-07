import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, RegisterService, registerDriverService, logoutService } from "../../auth/authServices";


const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
}

//Login Thunk
export const login = createAsyncThunk("auth/login",
    async (userData, thunkAPI) => {
        try {
            return await loginService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//Logout Thunk
export const logout = createAsyncThunk("auth/logout",
    async (_, thunkAPI) => {
        try {
            return await logoutService();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//Register owner Thunk
export const register = createAsyncThunk("auth/register",
    async (userData, thunkAPI) => {
        try {
            return await RegisterService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//Register driver Thunk
export const registerDriver = createAsyncThunk("auth/registerDriver",
    async (userData, thunkAPI) => {
        try {
            return await registerDriverService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);





const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            //Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                if (action.payload.token) {
                    localStorage.setItem("token", action.payload.token);
                }
                if (action.payload.user?.role) {
                    localStorage.setItem("role", action.payload.user.role);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            //logout
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = null;
                localStorage.clear();
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            //register owner
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            //register driver
            .addCase(registerDriver.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerDriver.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(registerDriver.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })


    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;
