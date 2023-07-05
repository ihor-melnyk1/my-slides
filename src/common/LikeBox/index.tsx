import { useState, type FC, useEffect, type MouseEventHandler } from 'react';

import HeartIcon from '@/images/heart.svg';

import styles from './index.module.css';
import classNames from 'classnames';
import { type PublicPresentation } from '@/app/types';
import { useSelector } from 'react-redux';
import { applicationSelector } from '@/store/applicationSlice';
import { fetchRequest } from '@/app/utils';

interface ButtonProps {
  presentation: PublicPresentation
}

const LikeBox: FC<ButtonProps> = ({ presentation }) => {
  const { user } = useSelector(applicationSelector);
  const [isLiked, setIsLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(presentation.likedUsers.length);
  useEffect(() => {
    if (user !== null) {
      setIsLiked(presentation.likedUsers.includes(user.id));
    }
  }, [user]);
  const handleClickLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikedCount(likedCount - 1);
    } else {
      setIsLiked(true);
      setLikedCount(likedCount + 1);
    }
    const userToken = localStorage.getItem('user');
    if (userToken !== null) {
      fetchRequest({
        url: '/presentation/like',
        method: 'POST',
        token: userToken,
        body: {
          presentationId: presentation.id,
        },
      }).then(data => console.log(data)).catch((e: Error) => { console.log(e); });
    }
  };
  return <div className={styles.like} onClick={handleClickLike}>
    <HeartIcon className={classNames({
      [styles.liked]: isLiked,
    })}/>
    <span>{likedCount}</span>
  </div>;
};

export default LikeBox;
