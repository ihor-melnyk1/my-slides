import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { type SlideData, type TextFieldData, type ImageData } from '@/app/types';
import { type AppState } from './store';

export interface PresentationState {
  slides: SlideData[]
  activeSlideIndex: number
  focusedElementId: string | null
  fullScreenSlideIndex: number | null
}

const initialState: PresentationState = {
  activeSlideIndex: 0,
  focusedElementId: null,
  fullScreenSlideIndex: null,
  slides: [],
};

const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    setPresentation (state, { payload }: PayloadAction<SlideData[]>) {
      state.slides = payload;
    },
    addSlide (state) {
      state.activeSlideIndex = state.slides.push({
        textFields: [],
        images: [],
        backgroundColor: '#ffffff',
        backgroundImage: null,
      }) - 1;
    },
    addTextField ({ slides, activeSlideIndex }) {
      const textFields = slides[activeSlideIndex].textFields;
      textFields?.push({
        id: uuidv4(),
        value: 'test',
        percentX: 0,
        percentY: 0,
        percentWidth: 100,
        percentHeight: 40,
        fontFamily: 'Times New Roman',
        fontSize: 14,
        percentFontSize: 0,
        fontWeight: 'normal',
        fontStyle: 'normal',
        backgroundColor: 'transparent',
        color: '#000000',
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'hidden',
      });
    },
    addImage (state, { payload }: PayloadAction<{ src: string, width: number, height: number, name: string }>) {
      const images = state.slides[state.activeSlideIndex].images;
      const id = uuidv4();
      images.push({
        id,
        src: payload.src,
        percentX: 0,
        percentY: 0,
        percentWidth: null,
        percentHeight: null,
        defaultWidth: payload.width,
        defaultHeight: payload.height,
        name: payload.name,
      });
      state.focusedElementId = id;
    },
    changeTextField ({ slides, activeSlideIndex }, { payload }: PayloadAction<{ id: string, newData: TextFieldData }>) {
      const textFields = slides[activeSlideIndex].textFields;
      const textFieldIndex = textFields?.findIndex(({ id }) => id === payload.id);
      textFields[textFieldIndex] = payload.newData;
    },
    changeImage ({ slides, activeSlideIndex }, { payload }: PayloadAction<{ id: string, newData: ImageData }>) {
      const images = slides[activeSlideIndex].images;
      if (images) {
        const imageIndex = images?.findIndex(({ id }) => id === payload.id);
        images[imageIndex] = { ...images[imageIndex], ...payload.newData };
      }
    },
    changeSlide ({ slides }, { payload }: PayloadAction<{ index: number, newData: SlideData }>) {
      slides[payload.index] = { ...slides[payload.index], ...payload.newData };
    },
    setActiveSlideIndex (state, { payload }: PayloadAction<number>) {
      state.activeSlideIndex = payload;
    },
    setFullScreenSlideIndex (state, { payload }: PayloadAction<number | null>) {
      state.fullScreenSlideIndex = payload;
    },
    setFocusedElementId (state, { payload }: PayloadAction<string | null>) {
      state.focusedElementId = payload;
    },
    deleteFocusedElement: ({ slides, activeSlideIndex, focusedElementId }) => {
      const { textFields, images } = slides[activeSlideIndex];
      let deleteIndex = textFields.findIndex(field => field.id === focusedElementId);
      if (deleteIndex >= 0) {
        textFields.splice(deleteIndex, 1);
      } else {
        deleteIndex = images.findIndex(field => field.id === focusedElementId);
        deleteIndex >= 0 && images.splice(deleteIndex, 1);
      }
    },
    deleteSlide: (state) => {
      state.slides.splice(state.activeSlideIndex, 1);
      if (state.activeSlideIndex !== 0) {
        state.activeSlideIndex -= 1;
      }
    },
  },
});

export const {
  addSlide,
  addTextField,
  changeTextField,
  setActiveSlideIndex,
  changeSlide,
  changeImage,
  addImage,
  setFocusedElementId,
  deleteFocusedElement,
  deleteSlide,
  setFullScreenSlideIndex,
  setPresentation,
} = presentationSlice.actions;

export const presentationSelector = (store: AppState) => store.presentation;

export default presentationSlice.reducer;
