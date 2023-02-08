import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userId: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload 
    },
    logout: (state) => {
      state.userId = null
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer