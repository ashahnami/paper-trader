import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { userApi } from '../api/userApi'
import { stockApi } from '../api/stockApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(userApi.middleware, stockApi.middleware),
})

