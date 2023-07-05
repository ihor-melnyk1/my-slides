import { borderStyleValues } from '@/app/types';
import Modal from '@/common/Modal';
import { changeSlide, changeTextField, presentationSelector } from '@/store/presentationSlice';
import { type FC, type ChangeEventHandler, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';

interface AppearanceModalProps {
  handleClose: () => void
}

const AppearanceModal: FC<AppearanceModalProps> = ({ handleClose }) => {
  const { slides, activeSlideIndex, focusedElementId } = useSelector(presentationSelector);
  const { textFields } = slides[activeSlideIndex];
  const activeField = textFields.find(field => field.id === focusedElementId);
  const dispatch = useDispatch();
  if ((activeField == null) || !focusedElementId) return null;
  const { backgroundColor, color, borderColor, borderStyle, borderWidth } = activeField;
  const handleChangeBackground: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(changeTextField({
      id: focusedElementId,
      newData: {
        ...activeField,
        backgroundColor: e.target.value,
      },
    }));
  };
  const handleChangeColor: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(changeTextField({
      id: focusedElementId,
      newData: {
        ...activeField,
        color: e.target.value,
      },
    }));
  };
  const handleChangeBorderWidth: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(changeTextField({
      id: focusedElementId,
      newData: {
        ...activeField,
        borderWidth: Number(e.target.value),
      },
    }));
  };
  const handleChangeBorderColor: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(changeTextField({
      id: focusedElementId,
      newData: {
        ...activeField,
        borderColor: e.target.value,
      },
    }));
  };
  const handleChangeSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
    dispatch(changeTextField({
      id: focusedElementId,
      newData: {
        ...activeField,
        borderStyle: e.target.value as typeof borderStyle,
      },
    }));
  };
  return <Modal title='Appearance' handleClose={handleClose}>
    <label className={styles.flexbox}>
            Background Color
      <input
        type="color"
        value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
        onChange={handleChangeBackground}
      />
    </label>
    <label className={styles.flexbox}>
            Text Color
      <input
        type="color"
        value={color}
        onChange={handleChangeColor}
      />
    </label>
    <label className={styles.flexbox}>
            Border Width
      <input
        type="number"
        min={0}
        value={borderWidth}
        onChange={handleChangeBorderWidth}
        className={styles.numberInput}
      />
    </label>
    <label className={styles.flexbox}>
            Border Color
      <input
        type="color"
        value={borderColor === 'transparent' ? '#ffffff' : borderColor}
        onChange={handleChangeBorderColor}
      />
    </label>
    <label className={styles.flexbox}>
            Border Color
      <select onChange={handleChangeSelect} value={borderStyle}>
        {borderStyleValues.map((option, index) => {
          return <option key={index} >
            {option}
          </option>;
        })}
      </select>
    </label>
  </Modal>;
};

export default AppearanceModal;
