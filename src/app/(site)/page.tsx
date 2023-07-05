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
  const { publicPresentations } = useSelector(applicationSelector);
  const [filteredPresentations, setFilteredPresentations] = useState<PublicPresentation[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchOption, setSearchOption] = useState<'name' | 'topic' | 'author'>('name');
  useEffect(() => {
    if (publicPresentations.length > 0) {
      setFilteredPresentations(publicPresentations);
    }
  }, [publicPresentations]);
  useEffect(() => {
    setFilteredPresentations(publicPresentations.filter(
      (presentation) => {
        let field = presentation[searchOption];
        if (searchOption === 'author') {
          field = presentation.author.name;
        }
        return String(field).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
      }));
  }, [searchValue, searchOption]);
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.heading}>Public Presentations</h1>
        <div className={styles.searchWrapper}>
          <div className={styles.search}>
            <SearchIcon />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
              placeholder='Search...'
            />
            <CloseIcon className={styles.icon} onClick={() => setSearchValue('')}/>
          </div>
          <select
            onChange={(e) => setSearchOption(e.target.value)}
            value={searchOption}
            className={styles.select}
          >
            {searchOptions.map((option, index) => {
              return <option key={index} >
                {option}
              </option>;
            })}
          </select>
        </div>
        <ul className={styles.list}>
          {filteredPresentations.map((presentation) =>
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
