// lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Music {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  spotifyId?: string;
  youtubeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse {
  status: string;
  query: string;
  total: number;
  results: Music[];
}

export interface MusicDetailResponse {
  status: string;
  data: Music | null;
}

export interface Universe {
  music: Music;
  books: any[];
  videos: any[];
  articles: any[];
}

export interface UniverseResponse {
  status: string;
  data: Universe | null;
}

export async function searchMusic(query: string): Promise<Music[]> {
  try {
    const response = await fetch(
      `${API_URL}/music/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    const data: SearchResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getMusicDetail(id: string): Promise<Music | null> {
  try {
    const response = await fetch(`${API_URL}/music/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch music: ${response.statusText}`);
    }
    const data: MusicDetailResponse = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Detail fetch error:', error);
    return null;
  }
}

export async function getMusicUniverse(id: string): Promise<Universe | null> {
  try {
    const response = await fetch(`${API_URL}/music/${id}/universe`);
    if (!response.ok) {
      throw new Error(`Failed to fetch universe: ${response.statusText}`);
    }
    const data: UniverseResponse = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Universe fetch error:', error);
    return null;
  }
}
