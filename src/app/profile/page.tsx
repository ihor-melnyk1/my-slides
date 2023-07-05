'use client';
import { type FormEventHandler, useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from '../utils';
import { applicationSelector, setUser } from '@/store/applicationSlice';
import classNames from 'classnames';
import Header from '@/common/Header';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(applicationSelector);
  const [inputData, setInputData] = useState({
    email: '',
    name: '',
  });
  useEffect(() => {
    if (user != null) {
      setInputData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);
  const [inputErrors, setInputErrors] = useState({
    email: '',
    name: '',
  });
  const handleSubmitForm: FormEventHandler = (e) => {
    e.preventDefault();
    fetchRequest({
      url: '/user/login',
      method: 'POST',
      body: inputData,
    }).then(result => {
      if (result.errors !== undefined) {
        setInputErrors(result.errors);
      } else {
        localStorage.setItem('user', result.token);
        dispatch(setUser(result.user));
        router.push('/');
      }
    }).catch((e: Error) => { console.log(e); });
  };
  const handleLogOut = () => {
    localStorage.removeItem('user');
    dispatch(setUser(null));
    router.push('/login');
  };
  return <div className={styles.wrapper}>
    <Header />
    <h1>Edit Profile</h1>
    <form onSubmit={handleSubmitForm} className={styles.inputWrapper}>
      <label className={styles.label}>
        Name
        <input
          value={inputData.name}
          onChange={(e) => { setInputData((prev) => ({ ...prev, name: e.target.value })); }}
          className={styles.input}
          placeholder='Name'
          type='text'
          required
        />
      </label>
      <p className={styles.error}>{inputErrors.name}</p>
      <label className={styles.label}>
        Email
        <input
          value={inputData.email}
          onChange={(e) => { setInputData((prev) => ({ ...prev, email: e.target.value })); }}
          className={styles.input}
          placeholder='Email'
          type='email'
          required
        />
      </label>
      <p className={styles.error}>{inputErrors.email}</p>
      <button type='submit' className={styles.button}>Save Changes</button>
    </form>
    <button
      className={classNames(styles.button, styles.logout)}
      onClick={handleLogOut}
    >
      Log Out
    </button>
  </div>;
};

export default LoginPage;
