import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { userApi } from '../api/userApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(userApi.middleware),
})

