// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const leadSlice = createSlice({
  name: 'lead',
  initialState: {
    currentLeadId: null,
    currentLead: null
  },
  reducers: {
    setCurrentLeadId: (state, action) => {
      state.currentLeadId = action.payload
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload
    }
  }
})

export const { setCurrentLeadId, setCurrentLead } = leadSlice.actions

export default leadSlice.reducer
