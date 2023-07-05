'use client';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setPublicPresentations, setUser, setUserPresentations } from '@/store/applicationSlice';
import { fetchRequest } from './utils';

export default function App ({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const userToken = localStorage.getItem('user');
    if (userToken !== null) {
      fetchRequest({
        method: 'GET',
        url: '/user/profile',
        token: userToken,
      }).then(user => dispatch(setUser(user))).catch((e: Error) => {
        console.log(e.message);
      });
      fetchRequest({
        method: 'GET',
        url: '/presentation',
        token: userToken,
      }).then(presentations => dispatch(setUserPresentations(presentations)))
        .catch((e: Error) => {
          console.log(e.message);
        });
    }
    fetchRequest({
      method: 'GET',
      url: '/presentation/public',
    }).then(presentations => dispatch(setPublicPresentations(presentations))).catch((e: Error) => {
      console.log(e.message);
    });
  }, []);
  return <>{children}</>;
}
