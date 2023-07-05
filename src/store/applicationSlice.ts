import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type AppState } from './store';
import { type PresentationState } from './presentationSlice';
import {
  type PublicPresentation, type UserPresentation, type SlideData,
} from '@/app/types';

type User = {
  id: string
  email: string
  name: string
} | null;

interface ApplicationState {
  user: User
  publicPresentations: PublicPresentation[]
  userPresentations: UserPresentation[]
}

const initialState: ApplicationState = {
  user: null,
  publicPresentations: [],
  userPresentations: [],
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setUser (state, { payload }: PayloadAction<User>) {
      state.user = payload;
    },
    setPublicPresentations (state, { payload }: PayloadAction<PublicPresentation[]>) {
      state.publicPresentations = payload;
    },
    setUserPresentations (state, { payload }: PayloadAction<UserPresentation[]>) {
      state.userPresentations = payload;
    },
  },
});

export const {
  setUser,
  setPublicPresentations,
  setUserPresentations,
} = applicationSlice.actions;

export const applicationSelector = (store: AppState) => store.application;

export default applicationSlice.reducer;
