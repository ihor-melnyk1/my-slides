import { type UserPresentation, type PublicPresentation } from '@/app/types';
import { useState, type FC, useEffect } from 'react';
import styles from './index.module.css';
import SlidePreview from '@/app/presentation/SlidePreview';
import { format } from 'date-fns';

import PresentationIcon from '@/images/presentation.svg';
import TopicIcon from '@/images/topic.svg';
import PersonIcon from '@/images/person.svg';
import HeartIcon from '@/images/heart.svg';
import { fetchRequest } from '@/app/utils';
import { useSelector } from 'react-redux';
import { applicationSelector } from '@/store/applicationSlice';
import classNames from 'classnames';
import LikeBox from '@/common/LikeBox';
import Link from 'next/link';

interface PresentationCardProps {
  presentation: UserPresentation
}

const PresentationCard: FC<PresentationCardProps> = ({ presentation }) => {
  return <div className={styles.wrapper}>
    <Link href={'/presentation/' + presentation.id + '/edit'}>
      <SlidePreview slideData={presentation.slides[0]} index={0}/>
    </Link>
    <div className={styles.nameBox}>
      <PresentationIcon />
      {presentation.name}
    </div>
    <div className={styles.nameBox}>
      <TopicIcon />
      {presentation.topic}
    </div>
    <div className={styles.date}>
      Updated {format(new Date(presentation.updatedAt), 'MMM dd, yyyy')}
    </div>
  </div>;
};

export default PresentationCard;
