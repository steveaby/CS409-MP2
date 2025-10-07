import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPokemonList, fetchPokemonDetails } from '../../api/pokemonAPI';
import styles from './ListView.module.css';

export default function ListView() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [detailsMap, setDetailsMap] = useState<any>({});
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'id'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemonList().then(async data => {
      const results = data.results.slice(0, 60);
      setPokemons(results);
      const detailPromises = results.map(p => fetchPokemonDetails(p.name));
      const allDetails = await Promise.all(detailPromises);
      const map: any = {};
      allDetails.forEach(d => (map[d.name] = d));
      setDetailsMap(map);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = pokemons.filter(p => {
      const details = detailsMap[p.name];
      if (!details) return false;
      return p.name.toLowerCase().includes(search.toLowerCase());
    });

    list.sort((a, b) => {
      const aDetails = detailsMap[a.name];
      const bDetails = detailsMap[b.name];
      if (!aDetails || !bDetails) return 0;

      let valA: string | number;
      let valB: string | number;

      if (sortField === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else {
        valA = aDetails.id;
        valB = bDetails.id;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [pokemons, detailsMap, search, sortField, sortOrder]);

  return (
    <div className={styles.container}>
      {/* Search and Sorting */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchBar}
        />

        <div className={styles.sortControls}>
          <button
            className={`${styles.sortButton} ${sortField === 'id' ? styles.activeButton : ''}`}
            onClick={() => setSortField('id')}
          >
            Sort by ID
          </button>

          <button
            className={`${styles.sortButton} ${sortField === 'name' ? styles.activeButton : ''}`}
            onClick={() => setSortField('name')}
          >
            Sort by Name
          </button>

          <button
            className={`${styles.orderButton} ${sortOrder === 'asc' ? styles.activeButton : ''}`}
            onClick={() => setSortOrder('asc')}
          >
            ↑ Asc
          </button>

          <button
            className={`${styles.orderButton} ${sortOrder === 'desc' ? styles.activeButton : ''}`}
            onClick={() => setSortOrder('desc')}
          >
            ↓ Desc
          </button>
        </div>
      </div>

      {/* Pokémon List */}
      <div className={styles.listContainer}>
        {filtered.map(p => {
          const details = detailsMap[p.name];
          if (!details) return null;
          return (
            <div
              key={p.name}
              className={styles.listItem}
              onClick={() => navigate(`/detail/${details.id}?tab=list`)}
            >
              <span className={styles.id}>#{details.id}</span>
              <img src={details.sprites.front_default} alt={p.name} className={styles.sprite} />
              <div className={styles.info}>
                <h3>{p.name}</h3>
                <div className={styles.types}>
                  {details.types.map((t: any) => (
                    <span key={t.type.name} className={`${styles.type} ${styles[t.type.name]}`}>
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
