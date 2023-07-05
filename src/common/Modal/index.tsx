import { type FC, type ReactNode } from 'react';

import CloseIcon from '../../images/close.svg';

import styles from './index.module.css';

interface ModalProps {
  title: string
  handleClose: () => void
  children: ReactNode
}

const Modal: FC<ModalProps> = ({ title, handleClose, children }) => {
  return <div className={styles.modal}>
    <div className={styles.modalContent}>
      <div className={styles.flexbox}>
        <h3 className={styles.heading}>{title}</h3>
        <CloseIcon onClick={handleClose} className={styles.closeIcon}/>
      </div>
      {children}
    </div>
  </div>;
};

export default Modal;
