import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchPokemonDetails } from '../../api/pokemonAPI';
import styles from './DetailView.module.css';
import logo from '../../assets/Pokedex.png';

const typeColors: Record<string, string> = {
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

export default function DetailView() {
  const { id } = useParams<{ id?: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Read initial tab from location state or default to 'list'
  const initialTab = (location.state as any)?.tab || 'list';
  const [tab] = useState<'list' | 'gallery'>(initialTab); // Removed unused setTab

  useEffect(() => {
    if (id) {
      fetchPokemonDetails(id).then((data: any) => setPokemon(data));
    }
  }, [id]);

  if (!id) return <p>Invalid Pokémon ID</p>;
  if (!pokemon) return <p>Loading...</p>;

  const pokemonId = parseInt(id, 10);

  return (
    <div className={styles.container}>
      {/* Header with Logo and Tab Navigation */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Pokédex Logo" />
          <h1>Pokédex Explorer</h1>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${tab === 'list' ? styles.active : ''}`}
            onClick={() => navigate('/?tab=list')}
          >
            List View
          </button>
          <button
            className={`${styles.navButton} ${tab === 'gallery' ? styles.active : ''}`}
            onClick={() => navigate('/?tab=gallery')}
          >
            Gallery View
          </button>
        </nav>
      </header>

      {/* Pokémon Card */}
      <div className={styles.card}>
        <div className={styles.topSection}>
          {/* Left Column: Image, Name, Types */}
          <div className={styles.leftColumn}>
            <h1 className={styles.title}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} #{pokemon.id}
            </h1>
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className={styles.sprite}
            />
            <div className={styles.types}>
              {pokemon.types.map((t: any) => (
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

          {/* Right Column: Stats, Abilities, Info */}
          <div className={styles.rightColumn}>
            <div className={styles.basicInfo}>
              <p><strong>Height:</strong> {pokemon.height}</p>
              <p><strong>Weight:</strong> {pokemon.weight}</p>
              <p><strong>Base XP:</strong> {pokemon.base_experience}</p>
            </div>

            <div className={styles.abilities}>
              <h3>Abilities</h3>
              <div className={styles.abilityList}>
                {pokemon.abilities.map((a: any) => (
                  <span key={a.ability.name} className={styles.abilityBadge}>
                    {a.ability.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.stats}>
              <h3>Stats</h3>
              {pokemon.stats.map((s: any) => (
                <div key={s.stat.name} className={styles.stat}>
                  <span className={styles.statName}>{s.stat.name}</span>
                  <div className={styles.statBarContainer}>
                    <div className={styles.statBar}>
                      <div
                        className={styles.statBarFill}
                        style={{
                          width: `${s.base_stat > 150 ? 100 : (s.base_stat / 150) * 100}%`,
                          background: `linear-gradient(90deg, #ef5350, #ffeb3b)`,
                        }}
                      />
                    </div>
                    <span className={styles.statValue}>{s.base_stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className={styles.navigation}>
          <button
            onClick={() => navigate(`/detail/${pokemonId - 1}`, { replace: true })}
            disabled={pokemonId <= 1}
          >
            ← Previous
          </button>
          <button
            onClick={() => navigate(`/detail/${pokemonId + 1}`, { replace: true })}
            disabled={pokemonId >= 898}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
