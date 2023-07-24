import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import { appcenterApi } from './slices';
import auth from './slices/auth';

export const store = configureStore({
  reducer: {
    [appcenterApi.reducerPath]: appcenterApi.reducer,
    auth: auth
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(appcenterApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
