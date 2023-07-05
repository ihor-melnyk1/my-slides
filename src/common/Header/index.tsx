'use client';
import { useState, type FC, type ReactNode } from 'react';

import styles from './index.module.css';
import { useSelector } from 'react-redux';
import { applicationSelector } from '@/store/applicationSlice';
import Link from 'next/link';
import CreatePresentationModal from '@/app/(site)/CreatePresentationModal';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import Button from '../Button';

const Header = () => {
  const { user } = useSelector(applicationSelector);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCreatePresentation = () => {
    setIsCreateModalOpen(true);
  };
  const pathname = usePathname();
  return <header className={styles.header}>
    <div className={styles.name}>My Slides</div>
    <ul className={styles.links}>
      <li>
        <Link href={'/my'} className={styles.link}>
          My Presentations
        </Link>
      </li>
      <li>
        <Link
          href={'/'}
          className={classNames(styles.link, {
            [styles.active]: pathname === '/',
          })}
        >
          Dashboard
        </Link>
      </li>
      <li>
        <span
          className={styles.link}
          onClick={handleCreatePresentation}
        >
          Create Presentation
        </span>
      </li>
    </ul>
    <div>
      {user === null
        ? <div className={styles.buttons}>
          <Button>
            <Link className={styles.buttonLink} href={'/login'}>Log In</Link>
          </Button>
          <Button>
            <Link className={styles.buttonLink} href={'/signup'}>Sign Up</Link>
          </Button>
        </div>
        : <Link
          href='/profile'
          className={classNames(styles.link, {
            [styles.active]: pathname === '/profile',
          })}
        >
        Profile
        </Link>}
    </div>
    {
      isCreateModalOpen &&
      <CreatePresentationModal handleClose={() => { setIsCreateModalOpen(false); }}/>
    }
  </header>;
};

export default Header;
