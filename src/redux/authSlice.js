import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    login: false,
    user: null
  },
  reducers: {
    handleLogin: (state, action) => {
      state.login = action.payload.login
      state.user = action.payload.user
    },
    handleLogout: (state, action) => {
      state.login = false
      state.user = null
      // localStorage.setItem('token', '')
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
