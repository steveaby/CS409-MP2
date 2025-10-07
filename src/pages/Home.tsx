import React, { useState, useEffect } from 'react';
import ListView from '../components/ListView/ListView';
import GalleryView from '../components/GalleryView/GalleryView';
import styles from './Home.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/Pokedex.png';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read tab from URL query param
  const params = new URLSearchParams(location.search);
  const initialTab = (params.get('tab') as 'list' | 'gallery') || 'list';
  const [tab, setTab] = useState<'list' | 'gallery'>(initialTab);

  // Update tab if URL changes (e.g., coming from DetailView)
  useEffect(() => {
    const tabFromUrl = (new URLSearchParams(location.search).get('tab') as 'list' | 'gallery') || 'list';
    setTab(tabFromUrl);
  }, [location.search]);

  const handleTabClick = (newTab: 'list' | 'gallery') => {
    setTab(newTab);
    // Update URL so DetailView buttons can link correctly
    navigate(`/?tab=${newTab}`, { replace: true });
  };

  return (
    <div className={styles.container}>
      {/* Header identical to DetailView */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Pokédex Logo" />
          <h1>Pokédex Explorer</h1>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${tab === 'list' ? styles.active : ''}`}
            onClick={() => handleTabClick('list')}
          >
            List View
          </button>
          <button
            className={`${styles.navButton} ${tab === 'gallery' ? styles.active : ''}`}
            onClick={() => handleTabClick('gallery')}
          >
            Gallery View
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {tab === 'list' ? <ListView /> : <GalleryView />}
      </main>
    </div>
  );
}
