import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { usersApiSlice } from './usersApiSlice'; // On importe le bon slice

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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      // On cible la mutation "logout" dans le bon fichier : usersApiSlice
      usersApiSlice.endpoints.logout.matchFulfilled,
      (state, action) => {
        // On vide le cache de l'API à la déconnexion
        action.dispatch(apiSlice.util.resetApiState());
      }
    );
  },
});

export const { setCredentials, logout, updateUserStatus } = authSlice.actions;

export default authSlice.reducer;