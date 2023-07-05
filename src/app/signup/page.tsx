'use client';
import { type FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';
import { useDispatch, useSelector } from 'react-redux';
import Header from '@/common/Header';
import Button from '@/common/Button';
import { setUser } from '@/store/applicationSlice';

const SignUpPage = () => {
  const router = useRouter();
  const store = useSelector(store => store);
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    name: '',
    email: '',
    password: '',
  });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmitForm: FormEventHandler = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(inputData),
    });
    if (response.status === 200) {
      const result = await response.json();
      localStorage.setItem('user', result.token);
      dispatch(setUser(result.user));
      router.push('/');
    }
  };
  return <div className={styles.wrapper}>
    <Header />
    <h1>Create an account</h1>
    <form onSubmit={handleSubmitForm} className={styles.inputWrapper}>
      <input
        value={inputData.name}
        onChange={(e) => { setInputData((prev) => ({ ...prev, name: e.target.value })); }}
        className={styles.input}
        placeholder='Name'
        required
      />
      <input
        value={inputData.email}
        onChange={(e) => { setInputData((prev) => ({ ...prev, email: e.target.value })); }}
        className={styles.input}
        placeholder='Email'
        type='email'
        required
      />
      <input
        value={inputData.password}
        onChange={(e) => { setInputData((prev) => ({ ...prev, password: e.target.value })); }}
        className={styles.input}
        placeholder='Password'
        type='password'
        required
        minLength={5}
      />
      <Button type='submit'>Sign Up</Button>
    </form>
  </div>;
};

export default SignUpPage;
