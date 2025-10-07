export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: { front_default?: string | null }
  }
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: { ability: { name: string } }[];
  base_experience: number;
}
