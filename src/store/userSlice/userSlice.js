import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  role: null,
  accessToken: null,
  store: null,
  adminScopes: null,
  isLogin: false,
  lowStockCheckToken: 0,
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
      state.isLogin = true;
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
      state.isLogin = false;
    },
    triggerLowStockCheck: state => {
      state.lowStockCheckToken += 1;
    },
  },
});

export const { setData, updateToken, logOut, triggerLowStockCheck } = userSlice.actions;

export const userReducer = userSlice.reducer;
