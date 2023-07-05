import { presentationTopicValues, type SlideData, type UserPresentation } from '@/app/types';
import Modal from '@/common/Modal';
import { type FC, useState, type FormEventHandler } from 'react';
import styles from './index.module.css';
import { useRouter } from 'next/navigation';
import { fetchRequest } from '@/app/utils';
import { useDispatch, useSelector } from 'react-redux';
import { applicationSelector, setUserPresentations } from '@/store/applicationSlice';
import Button from '@/common/Button';

interface CreatePresentationModalProps {
  handleClose: () => void
  slides?: SlideData[]
}

const CreatePresentationModal: FC<CreatePresentationModalProps> = ({ handleClose, slides }) => {
  const [inputValues, setInputValues] = useState({
    name: '',
    topic: 'Topic',
    isPublic: false,
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const { userPresentations } = useSelector(applicationSelector);
  const handleSubmitForm: FormEventHandler = (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      router.push('/signup');
    } else {
      fetchRequest({
        url: '/presentation',
        method: 'POST',
        token: userToken,
        body: {
          ...inputValues,
          slides,
        },
      }).then((result: UserPresentation) => {
        dispatch(setUserPresentations([...userPresentations, result]));
        router.push('/presentation/' + result.id + '/edit');
      }).catch((e: Error) => { console.log(e); });
    }
  };
  return <Modal title='Create Presentation' handleClose={handleClose}>
    <form className={styles.wrapper} onSubmit={handleSubmitForm}>
      <input
        type="text"
        value={inputValues.name}
        onChange={(e) => setInputValues((values) => ({ ...values, name: e.target.value }))}
        placeholder='Name'
        required
        className={styles.input}
      />
      <select
        onChange={(e) => setInputValues((values) => ({ ...values, topic: e.target.value }))}
        value={inputValues.topic}
        required
        className={styles.input}
      >
        <option disabled>Topic</option>
        {presentationTopicValues.map((option, index) => {
          return <option key={index} >
            {option}
          </option>;
        })}
      </select>
      <label className={styles.flexbox}>
        <input
          type='checkbox'
          checked={inputValues.isPublic}
          onChange={(e) => setInputValues((values) => ({ ...values, isPublic: !values.isPublic }))}
          className={styles.checkbox}
        />
      Make presentation public
      </label>
      <Button type='submit'>Create</Button>
    </form>
  </Modal>;
};

export default CreatePresentationModal;
