import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('favorites')
  ? JSON.parse(localStorage.getItem('favorites'))
  : { favoriteItems: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const item = action.payload;
      const existItem = state.favoriteItems.find((x) => x._id === item._id);
      if (!existItem) {
        state.favoriteItems.push(item);
      }
      localStorage.setItem('favorites', JSON.stringify(state));
    },
    removeFromFavorites: (state, action) => {
      state.favoriteItems = state.favoriteItems.filter(
        (x) => x._id !== action.payload
      );
      localStorage.setItem('favorites', JSON.stringify(state));
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;