'use client';
import {
  useState, useRef, useEffect, useCallback, type ChangeEventHandler,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import Slide from '../../Slide';
import SlidePreview from '../../SlidePreview';
import BackgroundModal from '../../BackgroundModal';
import FontModal from '../../FontModal';
import AppearanceModal from '../../AppearanceModal';

import styles from './page.module.css';

import {
  addImage, addSlide, addTextField, changeTextField, deleteFocusedElement, deleteSlide,
  presentationSelector, setActiveSlideIndex, setFocusedElementId, setFullScreenSlideIndex,
  setPresentation,
} from '@/store/presentationSlice';
import { fetchRequest } from '@/app/utils';
import { applicationSelector } from '@/store/applicationSlice';
import { useRouter } from 'next/navigation';
import Header from '@/common/Header';
import Button from '@/common/Button';

export default function Home ({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userPresentations } = useSelector(applicationSelector);
  const presentationData = userPresentations.find(presentation => presentation.id === params.id);
  useEffect(() => {
    if (userPresentations.length > 0 && presentationData === undefined) {
      // router.replace('/404');
    } else if (presentationData?.slides !== undefined) {
      console.log(presentationData.slides);
      dispatch(setPresentation(presentationData?.slides));
    }
  }, [userPresentations, presentationData]);

  const {
    slides, activeSlideIndex, focusedElementId, fullScreenSlideIndex,
  } = useSelector(presentationSelector);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);
  useEffect(() => {
    const getData = setTimeout(() => {
      const userToken = localStorage.getItem('user');
      if (userToken !== null) {
        fetchRequest({
          url: '/presentation/' + params.id,
          method: 'PUT',
          token: userToken,
          body: slides,
        }).catch(e => console.log(e));
      }
    }, 2000);
    return () => clearTimeout(getData);
  }, [slides]);
  const keyPressListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && fullScreenSlideIndex !== null) {
      if (fullScreenSlideIndex === slides.length - 1) {
        // document.exitFullscreen();
      } else {
        dispatch(setFullScreenSlideIndex(fullScreenSlideIndex + 1));
      }
    }
  }, [fullScreenSlideIndex, dispatch, slides.length]);
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
  const handleAddSlide = () => {
    dispatch(addSlide());
  };
  const handleAddTextField = () => {
    dispatch(addTextField());
  };
  const handleClickSlide = (index: number) => {
    dispatch(setActiveSlideIndex(index));
  };
  const handleClickBackground = () => {
    setIsBackgroundModalOpen(true);
  };
  const handleAddImage = () => {
    imageRef?.current?.click();
  };
  const handleDeleteElement = () => {
    dispatch(deleteFocusedElement());
    dispatch(setFocusedElementId(null));
  };
  const handleDeleteSlide = () => {
    dispatch(deleteSlide());
  };
  const imageRef = useRef<HTMLInputElement>(null);
  const handlePhotoInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const image = e.target.files?.item(0);
    if (image != null) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        const img = new Image();
        img.src = String(reader.result);
        img.onload = () => {
          dispatch(addImage({
            src: String(reader.result),
            width: img.width,
            height: img.height,
            name: image.name,
          }));
        };
      };
    }
  };
  const handleFullscreen = () => {
    dispatch(setFullScreenSlideIndex(activeSlideIndex));
  };
  const activeSlide = slides[activeSlideIndex];
  const activeField = activeSlide?.textFields.find(field => field.id === focusedElementId);
  if (presentationData === undefined || activeSlide === undefined) return null;
  return <div className={styles.page}>
    <Header />
    <div className={styles.panel}>
      <Button onClick={handleFullscreen}>SlideShow</Button>
      <Button onClick={handleAddSlide}>Add slide</Button>
      <Button onClick={handleAddTextField}>Add Text Field</Button>
      <Button onClick={handleAddImage}>Add Image</Button>
      <Button onClick={handleDeleteElement} disabled={focusedElementId === null}>
        Delete Element
      </Button>
      <Button onClick={handleDeleteSlide} disabled={slides.length < 2}>Delete Slide</Button>
      <input
        ref={imageRef}
        type='file'
        accept='image/*'
        onChange={handlePhotoInputChange}
        hidden
      />
      <Button onClick={handleClickBackground}>Change Background</Button>
      <Button onClick={() => { setIsFontModalOpen(true); }} disabled={focusedElementId === null}>
        Change Font
      </Button>
      {(activeField != null) && <div>
        <Button className={styles.fontButton} onClick={() => dispatch(changeTextField({
          id: activeField.id,
          newData: {
            ...activeField,
            fontSize: activeField.fontSize - 1,
          },
        }))}>-</Button>
        <input
          className={styles.fontInput}
          type='number'
          value={activeField.fontSize}
          onChange={(e) => dispatch(changeTextField({
            id: activeField.id,
            newData: {
              ...activeField,
              fontSize: Number(e.target.value),
            },
          }))}
        />
        <Button className={styles.fontButton} onClick={() => dispatch(changeTextField({
          id: activeField.id,
          newData: {
            ...activeField,
            fontSize: activeField.fontSize + 1,
          },
        }))}>+</Button>
      </div>}
      {(activeField != null) && <Button
        onClick={() => dispatch(changeTextField({
          id: activeField.id,
          newData: {
            ...activeField,
            fontWeight: activeField.fontWeight === 'bold' ? 'normal' : 'bold',
          },
        }))}
        disabled={focusedElementId === null}
        className={classNames(styles.boldButton, {
          [styles.activeButton]: activeField.fontWeight === 'bold',
        })}
      >B</Button>}
      {(activeField != null) &&
        <Button
          onClick={() => dispatch(changeTextField({
            id: activeField.id,
            newData: {
              ...activeField,
              fontStyle: activeField.fontStyle === 'italic' ? 'normal' : 'italic',
            },
          }))}
          disabled={focusedElementId === null}
          className={classNames(styles.italicButton, {
            [styles.activeButton]: activeField.fontStyle === 'italic',
          })}
        >I</Button>}
      {(activeField != null) &&
        <Button
          onClick={() => { setIsAppearanceModalOpen(true); }}
          disabled={focusedElementId === null}
        >
          Appearance
        </Button>}
    </div>
    <div className={styles.wrapper}>
      <ol className={styles.slides}>
        {slides.map((slide, index) =>
          <li
            className={classNames(styles.slide, {
              [styles.activeSlide]: index === activeSlideIndex,
            })}
            key={index}
            onClick={() => { handleClickSlide(index); }}
          >
            <SlidePreview slideData={slide} index={index}/>
          </li>,
        )}
      </ol>
      <div className={styles.slidePreview}>
        <Slide slideData={activeSlide}/>
      </div>
    </div>
    {isBackgroundModalOpen && <BackgroundModal
      handleClose={() => { setIsBackgroundModalOpen(false); }}
    />}
    {isFontModalOpen && <FontModal handleClose={() => { setIsFontModalOpen(false); }}/>}
    {isAppearanceModalOpen && <AppearanceModal
      handleClose={() => { setIsAppearanceModalOpen(false); }}
    />}
  </div>;
}
