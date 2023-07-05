import { Dimensions, ImageData } from '@/app/types'
import { calculateNumericValue, calculatePercentValue, getNumericSize } from '@/app/utils';
import { changeImage, presentationSelector, setFocusedElementId } from '@/store/presentationSlice'
import Image from 'next/image';
import { FC, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd'
import styles from './index.module.css'

type SlideImageProps = {
    data: ImageData,
    slideDimensions: Dimensions | null,
}

const SlideImage: FC<SlideImageProps> = ({data, slideDimensions}) => {
    const dispatch = useDispatch();
    const ref = useRef<Rnd>(null);
    const { focusedElementId } = useSelector(presentationSelector);
    useEffect(() => {
        if(slideDimensions && !data.percentWidth && !data.percentHeight) {
            const values = calculateDimensions();
            dispatch(changeImage({
                id: data.id,
                newData: {
                    ...data,
                    percentWidth: calculatePercentValue(values.maxWidth, slideDimensions.width),
                    percentHeight: calculatePercentValue(values.maxHeight, slideDimensions.height),
                }
            }))
        }
    }, [data.defaultWidth, data.defaultHeight, slideDimensions, data.percentWidth, data.percentHeight])
    if(slideDimensions === null) return null;
    
    const onDrag: RndDragCallback = (e, eventData) => {
        dispatch(changeImage({
            id: data.id,
            newData: {
                ...data,
                percentX: calculatePercentValue(eventData.x, slideDimensions.width),
                percentY: calculatePercentValue(eventData.y, slideDimensions.height)
            }
        }))
    }

    const onResize: RndResizeCallback = (e, direction, {style}, delta, position) => {
        dispatch(changeImage({
            id: data.id,
            newData: {
                ...data,
                percentX: calculatePercentValue(position.x, slideDimensions.width),
                percentY: calculatePercentValue(position.y, slideDimensions.height),
                percentWidth: calculatePercentValue(getNumericSize(style.width), slideDimensions.width),
                percentHeight: calculatePercentValue(getNumericSize(style.height), slideDimensions.height),
            }
        }))
    }
    const calculateDimensions = () => {
        let maxWidth = data.defaultWidth;
        let maxHeight = data.defaultHeight;
        if (maxWidth > slideDimensions.width) {
            maxHeight *= slideDimensions.width / maxWidth;
            maxWidth = slideDimensions.width;
        }
        if (maxHeight > slideDimensions.height) {
            maxWidth *= slideDimensions.height / maxHeight;
            maxHeight = slideDimensions.height;
        }
        return { maxWidth, maxHeight };
    }
    return <Rnd
        ref={ref}
        bounds='parent'
        onDragStop={onDrag}
        onResizeStop={onResize}
        lockAspectRatio={data.defaultWidth / data.defaultHeight}
        default={{
            x: calculateNumericValue(data.percentX, slideDimensions.width),
            y: calculateNumericValue(data.percentY, slideDimensions.height),
            width: data.percentWidth ? calculateNumericValue(data.percentWidth, slideDimensions.width) : data.defaultWidth,
            height: data.percentHeight ? calculateNumericValue(data.percentHeight, slideDimensions.height) : data.defaultHeight,
        }}
        {...calculateDimensions()}
        onMouseDown={() => {dispatch(setFocusedElementId(data.id))}}
        onDragStart={() => {dispatch(setFocusedElementId(data.id))}}
        onResizeStart={() => {dispatch(setFocusedElementId(data.id))}}
        style={{
            ...(focusedElementId === data.id) && {border: '1px solid black'}
        }}
    >   
        <Image
            className={styles.input}
            src={data.src}
            alt={data.name}
            fill
        />
    </Rnd>
}

export default SlideImage;