import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    updateUserStatus: (state, action) => {
      if (state.userInfo && state.userInfo._id === action.payload._id) {
        state.userInfo.status = action.payload.status;
        state.userInfo.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    },
    // NOUVELLE ACTION POUR METTRE À JOUR LE RÔLE
    updateUserRole: (state, action) => {
        if (state.userInfo && state.userInfo._id === action.payload.userId) {
            state.userInfo.isAdmin = action.payload.isAdmin;
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        }
    },
  },
});

export const { setCredentials, logout, updateUserStatus, updateUserRole } = authSlice.actions;

export default authSlice.reducer;