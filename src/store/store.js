import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import { userReducer } from './userSlice/userSlice';

const userPersisterConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'role', 'adminScopes'],
};

export const store = configureStore({
  reducer: {
    user: persistReducer(userPersisterConfig, userReducer),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
