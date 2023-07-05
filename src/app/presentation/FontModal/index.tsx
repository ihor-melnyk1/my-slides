import Modal from '@/common/Modal';
import { changeTextField, presentationSelector } from '@/store/presentationSlice';
import fonts from '@/styles/fonts';
import { FC, ChangeEventHandler, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmIcon from '@/images/confirm.svg';
import styles from './index.module.css';
import classNames from 'classnames';

type FontModalProps = {
    handleClose: Function
}

const FontModal: FC<FontModalProps> = ({handleClose}) => {
    const { slides, activeSlideIndex, focusedElementId } = useSelector(presentationSelector);
    const { textFields } = slides[activeSlideIndex];
    const activeField = textFields.find(field => field.id === focusedElementId);
    const dispatch = useDispatch();
    const handleClickItem = (key: keyof typeof fonts) => {
        focusedElementId && activeField && dispatch(changeTextField({
            id: focusedElementId,
            newData: {
                ...activeField,
                fontFamily: key
            }
        }))
    }
    return <Modal title='Choose Font Family' handleClose={handleClose}>
        <ul>
            {(Object.keys(fonts) as Array<keyof typeof fonts>).map(key => 
                <li key={key} className={classNames(styles.item, fonts[key].className)} onClick={() => handleClickItem(key)}>
                    {key}
                    {activeField?.fontFamily === key && <ConfirmIcon />}
                </li>
            )}
        </ul>
    </Modal>
}

export default FontModal;