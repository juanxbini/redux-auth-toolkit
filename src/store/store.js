import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

// Configuracion del store global
export default configureStore({
    reducer: {
        auth: authReducer,
    },
});