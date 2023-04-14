import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SlideData, TextFieldData } from '@/app/types'
import { AppState } from './store'

interface PresentationState {
    slides: Array<SlideData>,
    activeSlideIndex: number
}

const initialState = {
    activeSlideIndex: 0,
    slides: [
        {
            textFields: [
                {
                    value: 'test',
                    x: 10,
                    y: 10
                }
            ]
        }
    ]
} as PresentationState

const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    addSlide(state) {
        state.slides.push({});
    },
    addTextField({slides, activeSlideIndex}) {
        const textFields = slides[activeSlideIndex].textFields;
        textFields?.push({
            id: textFields.length + 1,
            value: '',
            x: 0,
            y: 0
        });
    },
    changeTextField({slides, activeSlideIndex}, {payload}: PayloadAction<{id: number, newData: TextFieldData}>) {
        const textFields = slides[activeSlideIndex].textFields;
        if(textFields) {
            const textFieldIndex = textFields?.findIndex(({id})=> id === payload.id);
            textFields[textFieldIndex] = payload.newData;
        }
    },
  },
})

export const { addSlide, addTextField, changeTextField } = presentationSlice.actions
export const presentationSelector = ((store: AppState) => store.presentation);
export default presentationSlice.reducer