import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUpdateAvailable: false,
  isUpdateInProgress: false,
};

const pwaSlice = createSlice({
  name: 'pwa',
  initialState,
  reducers: {
    setUpdateAvailable: (state, action) => {
      state.isUpdateAvailable = action.payload;
    },
    setUpdateInProgress: (state, action) => {
      state.isUpdateInProgress = action.payload;
    },
  },
});

export const { setUpdateAvailable, setUpdateInProgress } = pwaSlice.actions;

export default pwaSlice.reducer;