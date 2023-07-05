'use client';
import {
  useState, useEffect, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import SlidePreview from '../SlidePreview';

import styles from './page.module.css';

import {
  presentationSelector,
  setFullScreenSlideIndex,
  setPresentation,
} from '@/store/presentationSlice';
import { fetchRequest } from '@/app/utils';
import { applicationSelector } from '@/store/applicationSlice';
import { useRouter } from 'next/navigation';
import Header from '@/common/Header';
import Button from '@/common/Button';
import LikeBox from '@/common/LikeBox';
import CreatePresentationModal from '@/app/(site)/CreatePresentationModal';

export default function Home ({ params }: { params: { id: string } }) {
  const { publicPresentations } = useSelector(applicationSelector);
  const { fullScreenSlideIndex } = useSelector(presentationSelector);
  const presentation = publicPresentations.find(({ id }) => id === params.id);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (presentation !== undefined) {
      dispatch(setPresentation(presentation.slides));
    }
  }, [presentation]);
  const keyPressListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && fullScreenSlideIndex !== null) {
      if (presentation !== undefined &&
         fullScreenSlideIndex === presentation.slides.length - 1) {
        // document.exitFullscreen();
      } else {
        dispatch(setFullScreenSlideIndex(fullScreenSlideIndex + 1));
      }
    }
  }, [fullScreenSlideIndex, dispatch, presentation?.slides.length]);
  useEffect(() => {
    if (fullScreenSlideIndex !== null) {
      window.addEventListener('keypress', keyPressListener);
    } else {
      window.removeEventListener('keypress', keyPressListener);
    }

    return () => { window.removeEventListener('keypress', keyPressListener); };
  }, [fullScreenSlideIndex, keyPressListener]);

  useEffect(() => {
    function onFullscreenChange () {
      if (document.fullscreenElement != null) {
        console.log('We’re going fullscreen');
      } else {
        dispatch(setFullScreenSlideIndex(null));
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => { document.removeEventListener('fullscreenchange', onFullscreenChange); };
  }, []);
  const handleCreatePresentation = () => {
    setIsCreateModalOpen(true);
  };
  const handleFullscreen = () => {
    dispatch(setFullScreenSlideIndex(0));
  };
  if (presentation === undefined) {
    return null;
  }
  return <div className={styles.page}>
    <Header />
    <div className={styles.info}>
      <h1>{presentation.name}</h1>
      <div className={styles.flexbox}>
        <LikeBox presentation={presentation}/>
        <Button onClick={handleCreatePresentation}>Create a copy</Button>
        <Button onClick={handleFullscreen}>Present</Button>
      </div>
    </div>
    <ol className={styles.slides}>
      {presentation.slides.map((slide, index) =>
        <li
          className={classNames(styles.slide)}
          key={index}
        >
          <SlidePreview slideData={slide} index={index}/>
        </li>,
      )}
    </ol>
    {
      isCreateModalOpen &&
      <CreatePresentationModal
        slides={presentation.slides}
        handleClose={() => { setIsCreateModalOpen(false); }}
      />
    }
  </div>;
}
