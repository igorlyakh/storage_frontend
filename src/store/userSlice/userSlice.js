import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  role: null,
  accessToken: null,
  store: null,
  adminScopes: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
});

export const userReducer = userSlice.reducer;
