'use client';
import styles from './page.module.css';
import CreatePresentationModal from './CreatePresentationModal';
import { useEffect, useState } from 'react';
import Header from '@/common/Header';
import { useSelector } from 'react-redux';
import { applicationSelector } from '@/store/applicationSlice';
import SlidePreview from '../presentation/SlidePreview';
import PresentationCard from './PresentationCard';
import SearchIcon from '@/images/search.svg';
import CloseIcon from '@/images/close.svg';
import { type PublicPresentation } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const searchOptions = ['name', 'topic', 'author'];

export default function Home () {
  const router = useRouter();
  const { userPresentations } = useSelector(applicationSelector);
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.heading}>My Presentations</h1>
        <ul className={styles.list}>
          {userPresentations.map((presentation) =>
            <li
              key={presentation.id}
              className={styles.item}
            >
              <PresentationCard presentation={presentation}/>
            </li>,
          )}
        </ul>
      </main>
    </>
  );
}
