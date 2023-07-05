import { type Dimensions, type TextFieldData } from '@/app/types';
import {
  changeTextField,
  presentationSelector, setFocusedElementId,
} from '@/store/presentationSlice';
import { type ChangeEvent, type FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, type RndDragCallback, type RndResizeCallback } from 'react-rnd';
import styles from './index.module.css';
import classNames from 'classnames';
import fonts from '@/styles/fonts';
import { calculateNumericValue, calculatePercentValue, getNumericSize } from '@/app/utils';
interface TextFieldProps {
  data: TextFieldData
  slideDimensions: Dimensions | null
}

const TextField: FC<TextFieldProps> = ({ data, slideDimensions }) => {
  const dispatch = useDispatch();
  const ref = useRef<Rnd>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { focusedElementId } = useSelector(presentationSelector);
  useEffect(() => {
    if (slideDimensions != null) {
      dispatch(changeTextField({
        id: data.id,
        newData: {
          ...data,
          percentFontSize: calculatePercentValue(data.fontSize, slideDimensions.height),
        },
      }));
    }
  }, [data.fontSize, slideDimensions, dispatch]);

  if (slideDimensions === null) return null;

  const onDrag: RndDragCallback = (e, eventData) => {
    dispatch(changeTextField({
      id: data.id,
      newData: {
        ...data,
        percentX: calculatePercentValue(eventData.x, slideDimensions.width),
        percentY: calculatePercentValue(eventData.y, slideDimensions.height),
      },
    }));
  };

  const onResize: RndResizeCallback = (e, direction, { style }, delta, position) => {
    if (Number(textRef.current?.scrollHeight) <= getNumericSize(style.height)) {
      dispatch(changeTextField({
        id: data.id,
        newData: {
          ...data,
          percentX: calculatePercentValue(position.x, slideDimensions.width),
          percentY: calculatePercentValue(position.y, slideDimensions.height),
          percentWidth: calculatePercentValue(getNumericSize(style.width), slideDimensions.width),
          percentHeight: calculatePercentValue(getNumericSize(style.height),
            slideDimensions.height),
        },
      }));
    } else {
      ref.current?.updateSize({
        width: calculateNumericValue(data.percentWidth, slideDimensions.width),
        height: calculateNumericValue(data.percentHeight, slideDimensions.height),
      });
    }
  };
  const handleChangeInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const changes = {
      value: event.target.value,
      percentHeight: data.percentHeight,
    };
    const newHeight = event.target.scrollHeight;
    if (newHeight > calculateNumericValue(data.percentHeight, slideDimensions.height)) {
      ref.current?.updateSize({
        width: calculateNumericValue(data.percentWidth, slideDimensions.width),
        height: newHeight,
      });
      changes.percentHeight = calculatePercentValue(newHeight, slideDimensions.height);
    }
    dispatch(changeTextField({
      id: data.id,
      newData: {
        ...data,
        ...changes,
      },
    }));
  };
  return <Rnd
    ref={ref}
    bounds='parent'
    onDragStop={onDrag}
    onResizeStop={onResize}
    default={{
      x: calculateNumericValue(data.percentX, slideDimensions.width),
      y: calculateNumericValue(data.percentY, slideDimensions.height),
      width: calculateNumericValue(data.percentWidth, slideDimensions.width),
      height: calculateNumericValue(data.percentHeight, slideDimensions.height),
    }}
    onMouseDown={() => { dispatch(setFocusedElementId(data.id)); }}
    onDragStart={() => { dispatch(setFocusedElementId(data.id)); }}
    onResizeStart={() => { dispatch(setFocusedElementId(data.id)); }}
    style={{
      ...(focusedElementId === data.id) && { border: '1px solid black' },
    }}
  >
    <textarea
      className={classNames(styles.input, fonts[data.fontFamily].className)}
      style={{
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
        fontStyle: data.fontStyle,
        backgroundColor: data.backgroundColor,
        color: data.color,
        borderWidth: data.borderWidth,
        borderColor: data.borderColor,
        borderStyle: data.borderStyle,
      }}
      value={data.value}
      onChange={handleChangeInput}
      ref={textRef}
    />
  </Rnd>;
};

export default TextField;
