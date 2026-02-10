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
  reducers: {
    setData: (state, action) => {
      state.name = action.payload.username;
      state.accessToken = action.payload.accessToken;
    },
    logout: state => {
      state.name = null;
      state.accessToken = null;
    },
  },
});

export const { setData } = userSlice.actions;

export const userReducer = userSlice.reducer;
