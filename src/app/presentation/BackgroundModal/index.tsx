import Modal from '@/common/Modal';
import { changeSlide, presentationSelector } from '@/store/presentationSlice';
import { type FC, type ChangeEventHandler, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';

interface BackgroundModalProps {
  handleClose: Function
}

const BackgroundModal: FC<BackgroundModalProps> = ({ handleClose }) => {
  const slides = useSelector(presentationSelector).slides;
  const activeSlideIndex = useSelector(presentationSelector).activeSlideIndex;
  const activeSlide = slides[activeSlideIndex];
  const dispatch = useDispatch();
  const handleChangeBackground: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(changeSlide({
      index: activeSlideIndex,
      newData: {
        ...activeSlide,
        backgroundColor: e.target.value,
      },
    }));
  };
  const handleDeleteImage = () => {
    dispatch(changeSlide({
      index: activeSlideIndex,
      newData: {
        ...activeSlide,
        backgroundImage: null,
      },
    }));
  };
  const handlePhotoInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const image = e.target.files?.item(0);
    if (image != null) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        dispatch(changeSlide({
          index: activeSlideIndex,
          newData: {
            ...activeSlide,
            backgroundImage: String(reader.result),
          },
        }));
      };
    }
  };
  const photoInput = useRef<HTMLInputElement>(null);
  return <Modal title='Background' handleClose={handleClose}>
    <label className={styles.flexbox}>
            Color
      <input
        type="color"
        value={activeSlide.backgroundColor}
        onChange={handleChangeBackground}
      />
    </label>
    <div className={styles.flexbox}>
            Image
      <button onClick={() => photoInput?.current?.click()}>{activeSlide.backgroundImage ? 'Change Image' : 'Choose image'}</button>
      {activeSlide.backgroundImage && <button onClick={handleDeleteImage}>Delete Image</button>}
      <input
        ref={photoInput}
        type='file'
        accept='image/*'
        onChange={handlePhotoInputChange}
        hidden
      />
    </div>
  </Modal>;
};

export default BackgroundModal;
