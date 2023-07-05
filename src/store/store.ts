import { configureStore } from '@reduxjs/toolkit';
import presentationSlice from './presentationSlice';
import applicationSlice from './applicationSlice';

export const store = configureStore({
  reducer: {
    presentation: presentationSlice,
    application: applicationSlice,
  },
});

export type AppState = ReturnType<typeof store.getState>;
