'use client';
import { type FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from '../utils';
import { setUser } from '@/store/applicationSlice';
import Header from '@/common/Header';
import Button from '@/common/Button';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
  });
  const [inputErrors, setInputErrors] = useState({
    email: '',
    password: '',
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
  return <div className={styles.wrapper}>
    <Header/>
    <h1>Log in</h1>
    <form onSubmit={handleSubmitForm} className={styles.inputWrapper}>
      <input
        value={inputData.email}
        onChange={(e) => { setInputData((prev) => ({ ...prev, email: e.target.value })); }}
        className={styles.input}
        placeholder='Email'
        type='email'
        required
      />
      <p className={styles.error}>{inputErrors.email}</p>
      <input
        value={inputData.password}
        onChange={(e) => { setInputData((prev) => ({ ...prev, password: e.target.value })); }}
        className={styles.input}
        placeholder='Password'
        type='password'
        required
        minLength={5}
      />
      <p className={styles.error}>{inputErrors.password}</p>
      <Button type='submit'>Log in</Button>
    </form>
  </div>;
};

export default LoginPage;
