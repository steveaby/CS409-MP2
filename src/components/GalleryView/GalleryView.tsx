import React, { useEffect, useState, useMemo } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from '../../api/pokemonAPI';
import { useNavigate } from 'react-router-dom';
import styles from './GalleryView.module.css';

const typeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export default function GalleryView() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [detailsMap, setDetailsMap] = useState<{ [key: string]: any }>({});
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemonList().then(async (data) => {
      const results = data.results.slice(0, 60); // first 60 Pokémon
      setPokemons(results);

      const details = await Promise.all(results.map((p: any) => fetchPokemonDetails(p.name)));
      const map: any = {};
      details.forEach((d: any) => (map[d.name] = d));
      setDetailsMap(map);
    });
  }, []);

  const allTypes = useMemo(() => {
    const typesSet = new Set<string>();
    Object.values(detailsMap).forEach((d: any) => {
      if (d && d.types) d.types.forEach((t: any) => typesSet.add(t.type.name));
    });
    return Array.from(typesSet);
  }, [detailsMap]);

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((p: any) => {
      const d = detailsMap[p.name];
      if (!d) return false;
      const poketypes = d.types.map((t: any) => t.type.name);
      for (let st of selectedTypes) if (!poketypes.includes(st)) return false;
      return true;
    });
  }, [pokemons, detailsMap, selectedTypes]);

  const toggleType = (type: string) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(type)) newSet.delete(type);
    else newSet.add(type);
    setSelectedTypes(newSet);
  };

  return (
    <div className={styles.container}>
      {/* Filter buttons */}
      <div className={styles.filters}>
        {allTypes.map((type) => (
          <button
            key={type}
            className={`${styles.typeBtn} ${selectedTypes.has(type) ? styles.active : ''}`}
            style={{ borderColor: typeColors[type] }}
            onClick={() => toggleType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Pokémon grid */}
      <div className={styles.gallery}>
        {filteredPokemons.map((p: any) => {
          const d = detailsMap[p.name];
          if (!d) return null;
          return (
            <div
              key={p.name}
              className={styles.card}
              onClick={() => navigate(`/detail/${d.id}`)}
            >
              <img
                src={d.sprites.other['official-artwork'].front_default}
                alt={p.name}
                className={styles.pokemonImage}
              />
              <h3>{p.name}</h3>
              <div className={styles.types}>
                {d.types.map((t: any) => (
                  <span
                    key={t.type.name}
                    className={styles.typeBadge}
                    style={{ backgroundColor: typeColors[t.type.name] || '#777' }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
