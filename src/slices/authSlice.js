import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  showWelcome: false, // On ajoute le drapeau pour l'écran de bienvenue
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      state.showWelcome = true; // On lève le drapeau !
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    // Nouvelle action pour cacher l'écran de bienvenue après l'animation
    clearWelcome: (state) => {
      state.showWelcome = false;
    },
    updateUserStatus: (state, action) => {
      if (state.userInfo && state.userInfo._id === action.payload._id) {
        state.userInfo.status = action.payload.status;
        state.userInfo.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    },
    updateUserRole: (state, action) => {
        if (state.userInfo && state.userInfo._id === action.payload.userId) {
            state.userInfo.isAdmin = action.payload.isAdmin;
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        }
    },
  },
});

export const { setCredentials, logout, clearWelcome, updateUserStatus, updateUserRole } = authSlice.actions;

export default authSlice.reducer;