import axios from 'axios';
import { PokemonListResponse, PokemonDetails } from '../types/pokemon';
import { getCache, setCache } from '../utils/cache';

const BASE = 'https://pokeapi.co/api/v2';

const client = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

export async function fetchPokemonList(limit = 151, offset = 0) : Promise<PokemonListResponse> {
  const cacheKey = `pokemon_list_${limit}_${offset}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;
  const res = await client.get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
  setCache(cacheKey, res.data, 1000 * 60 * 60); // 1 hour
  return res.data;
}

export async function fetchPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
  const cacheKey = `pokemon_details_${nameOrId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;
  const res = await client.get<PokemonDetails>(`/pokemon/${nameOrId}`);
  setCache(cacheKey, res.data, 1000 * 60 * 60);
  return res.data;
}
