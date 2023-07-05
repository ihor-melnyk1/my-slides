import { type ButtonHTMLAttributes, type FC, type ReactNode } from 'react';

import styles from './index.module.css';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: ReactNode
}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return <button
    className={classNames(styles.button, className)}
    {...props}
  >
    {children}
  </button>;
};

export default Button;
