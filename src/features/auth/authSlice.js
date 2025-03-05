import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, thunkAPI) => {

    try {
        const response = await axios.post("http://localhost:3000/api/auth/login", credentials);
        const data = response.data;

        // Guardar el token en el local storage
        localStorage.setItem("token", data.token);

        return { user: data.user, token: data.token };

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Error en servidor");
    }

});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) =>{
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });

        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;