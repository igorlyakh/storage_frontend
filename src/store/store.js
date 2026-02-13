import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import { api } from './api/api';
import { userReducer } from './userSlice/userSlice';

const userPersisterConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'role', 'adminScopes', 'name'],
};

export const store = configureStore({
  reducer: {
    user: persistReducer(userPersisterConfig, userReducer),
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persister = persistStore(store);
