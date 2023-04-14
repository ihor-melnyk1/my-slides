'use client';
import { addSlide, addTextField, presentationSelector } from '@/store/presentationSlice';
import { AppState, useAppDispatch } from '@/store/store';
import { useState } from 'react';
import Draggable from 'react-draggable';
import { useSelector } from 'react-redux';
import styles from './page.module.css'
import Slide from './Slide'

export default function Home() {
    const slides = useSelector(presentationSelector).slides;
    console.log(slides);
    const dispatch = useAppDispatch();
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const activeSlide = slides[activeSlideIndex];
    const handleAddSlide = () => {
        dispatch(addSlide());
    }
    const handleAddTextField = () => {
        dispatch(addTextField());
    }
    return <div className={styles.page}>
        <div className={styles.panel}>
            <button onClick={handleAddSlide}>Add slide</button>
            <button onClick={handleAddTextField}>Add Text field</button>
        </div>
        <div className={styles.wrapper}>
            <div className={styles.slides}>
                {slides.map((slide, index) => <div className={styles.smallSlide} key={index}>
                    {'slide' + index}
                </div>)}
            </div>
            <div className={styles.slidePreview}>
                <Slide slideData={activeSlide}/>
            </div>
        </div>
    </div>
}
