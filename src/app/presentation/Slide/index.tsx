import { Dimensions, SlideData } from '@/app/types'
import { presentationSelector, setFocusedElementId } from '@/store/presentationSlice'
import { FC, useRef, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SlideImage from '../SlideImage'
import TextField from '../TextField'
import styles from './index.module.css'

type SlideProps = {
    slideData: SlideData
}

const Slide:FC<SlideProps> = ({slideData: {textFields, backgroundColor, backgroundImage, images}}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [slideDimensions, setSlideDimensions] = useState<Dimensions | null>(null);
    useEffect(() => {
        if(ref.current) {
        setSlideDimensions({width: ref.current.offsetWidth, height: ref.current.offsetHeight})
    }
    }, [ref.current?.offsetHeight, ref.current?.offsetWidth]);
    const focused = useSelector(presentationSelector).focusedElementId;
    const dispatch = useDispatch();
    return (
        <div 
            className={styles.wrapper} 
            ref={ref} 
            style={{
                backgroundColor,
                ...(backgroundImage) && {backgroundImage: `url(${backgroundImage})`}
            }}
            onClick={(e) => {
                if(e.target === ref.current) {
                    dispatch(setFocusedElementId(null));
                }
            }}
        >
            {textFields?.map((field) =>
            <TextField 
                data={field}
                slideDimensions={slideDimensions}
                key={field.id}
            />
            )}
            {images?.map((field) =>
            <SlideImage 
                data={field} 
                slideDimensions={slideDimensions} 
                key={field.id}
            />
            )}
        </div>
    )
}
export default Slide;