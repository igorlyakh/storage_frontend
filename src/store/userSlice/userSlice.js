import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
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
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.adminScopes = action.payload.adminScopes;
      state.accessToken = action.payload.accessToken;
    },
    updateToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logOut: state => {
      state.username = null;
      state.accessToken = null;
      state.role = null;
      state.adminScopes = null;
      state.store = null;
    },
  },
});

export const { setData, updateToken, logOut } = userSlice.actions;

export const userReducer = userSlice.reducer;
