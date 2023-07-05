import { type Dimensions, type SlideData } from '@/app/types';
import { calculateNumericValue } from '@/app/utils';
import { presentationSelector } from '@/store/presentationSlice';
import fonts from '@/styles/fonts';
import classNames from 'classnames';
import Image from 'next/image';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.css';

interface SlideProps {
  slideData: SlideData
  index: number
}

const SlidePreview: FC<SlideProps> = ({
  slideData: { backgroundColor, backgroundImage, textFields, images }, index,
}) => {
  const { fullScreenSlideIndex } = useSelector(presentationSelector);
  const [domNode, setDomNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (domNode != null) {
      if (fullScreenSlideIndex === index) {
        domNode.requestFullscreen().then(() => {
          setSlideDimensions({
            width: domNode.offsetWidth,
            height: domNode.offsetHeight,
          });
        }).catch(e => { console.log(e); });
      }
      setSlideDimensions({
        width: domNode.offsetWidth,
        height: domNode.offsetHeight,
      });
    }
  }, [fullScreenSlideIndex, index, domNode]);
  const [slideDimensions, setSlideDimensions] = useState<Dimensions | null>(null);
  const onRefChange = useCallback((node: HTMLDivElement) => {
    setDomNode(node);
    setSlideDimensions({
      width: node?.offsetWidth,
      height: node?.offsetHeight,
    });
  }, []);
  return <div
    ref={onRefChange}
    className={styles.wrapper}
    style={{
      backgroundColor,
      ...(backgroundImage !== null) && { backgroundImage: `url(${backgroundImage})` },
    }}
  >
    {(slideDimensions != null) && textFields.map(({
      id, percentX, percentY, percentFontSize, fontSize, percentHeight,
      percentWidth, value, fontFamily, fontWeight, fontStyle, backgroundColor, color, borderColor,
      borderStyle, borderWidth,
    }) =>
      <p
        key={id}
        style={{
          top: `${percentY}%`,
          left: `${percentX}%`,
          width: percentWidth + '%',
          height: percentHeight + '%',
          fontSize: percentFontSize
            ? calculateNumericValue(percentFontSize, slideDimensions.height)
            : fontSize,
          fontWeight,
          fontStyle,
          backgroundColor,
          color,
        }}
        className={classNames(styles.text, fonts[fontFamily].className)}
      >
        {value}
      </p>,
    )}
    {images.map(({ id, percentX, percentY, percentHeight, percentWidth, defaultWidth, defaultHeight, src, name }) =>
      <div
        key={id}
        style={{
          top: percentY + '%',
          left: percentX + '%',
          width: percentWidth ? (percentWidth + '%') : defaultWidth,
          height: percentHeight ? (percentHeight + '%') : defaultHeight,
        }}
        className={styles.imageWrapper}
      >
        <Image
          className={styles.image}
          src={src}
          alt={name}
          fill
        />
      </div>,
    )}
  </div>;
};

export default SlidePreview;
