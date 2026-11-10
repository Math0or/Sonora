import { Injectable } from '@nestjs/common';

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

// Mock data - v0.1 usando dados fictícios
const MOCK_MUSIC: Music[] = [
  {
    id: '1',
    title: 'Construção',
    artist: 'Chico Buarque',
    album: 'Construção',
    releaseDate: '1971-07-01',
    spotifyId: 'spotify:track:00000001',
    youtubeId: 'youtube:00000001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Vai Passar',
    artist: 'Chico Buarque',
    album: 'Vai Passar',
    releaseDate: '1980-01-01',
    spotifyId: 'spotify:track:00000002',
    youtubeId: 'youtube:00000002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Mulheres de Atenas',
    artist: 'Chico Buarque',
    album: 'Chico Buarque',
    releaseDate: '1976-01-01',
    spotifyId: 'spotify:track:00000003',
    youtubeId: 'youtube:00000003',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Clandestino',
    artist: 'Chico Buarque',
    album: 'Clandestino',
    releaseDate: '1977-01-01',
    spotifyId: 'spotify:track:00000004',
    youtubeId: 'youtube:00000004',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'A Banda',
    artist: 'Chico Buarque',
    album: 'Chico Buarque',
    releaseDate: '1966-01-01',
    spotifyId: 'spotify:track:00000005',
    youtubeId: 'youtube:00000005',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

@Injectable()
export class MusicService {
  /**
   * Busca músicas por título ou artista
   * v0.1: Retorna dados mockados
   * v0.2+: Integrará com SpotifyConnector
   */
  async search(query: string): Promise<Music[]> {
    // v0.1: Filtro simples sobre mock data
    const normalized = query.toLowerCase();

    const results = MOCK_MUSIC.filter(
      (music) =>
        music.title.toLowerCase().includes(normalized) ||
        music.artist.toLowerCase().includes(normalized)
    );

    // Retorna até 10 resultados
    return results.slice(0, 10);
  }

  /**
   * Obtém detalhes de uma música específica
   * v0.1: Retorna dados mockados
   * v0.2+: Buscará informações do banco + APIs
   */
  async findById(id: string): Promise<Music | null> {
    const music = MOCK_MUSIC.find((m) => m.id === id);
    return music || null;
  }

  /**
   * Lista todas as músicas
   * v0.1: Retorna mock data
   * v0.2+: Retornará do banco
   */
  async findAll(): Promise<Music[]> {
    return MOCK_MUSIC;
  }

  /**
   * Cria uma nova música no banco
   * v0.1: Mockado, apenas retorna
   * v0.2+: Persiste em PostgreSQL
   */
  async create(data: Omit<Music, 'id' | 'createdAt' | 'updatedAt'>): Promise<Music> {
    const now = new Date().toISOString();
    const newMusic: Music = {
      id: Math.random().toString(36).substring(7),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    return newMusic;
  }

  /**
   * Obtém o universo relacionado a uma música
   * v0.1: Dados mockados
   * v0.3+: Integra YouTube, Google Books, etc
   * v0.4+: Usa AI Pipeline
   */
  async getUniverse(musicId: string): Promise<{
    music: Music | null;
    books: any[];
    videos: any[];
    articles: any[];
  }> {
    const music = await this.findById(musicId);
    if (!music) {
      return { music: null, books: [], videos: [], articles: [] };
    }

    // v0.1: Mock data
    return {
      music,
      books: [
        {
          id: 'book-1',
          title: 'O Cortiço',
          author: 'Aluísio Azevedo',
          description: 'Romance clássico sobre desigualdade social',
          url: 'https://example.com/o-cortico',
        },
        {
          id: 'book-2',
          title: 'Grande Sertão: Veredas',
          author: 'Guimarães Rosa',
          description: 'Épica brasileira de autossuperação',
          url: 'https://example.com/grande-sertao',
        },
      ],
      videos: [
        {
          id: 'video-1',
          title: 'Chico Buarque - Ao Vivo',
          channel: 'Chico Buarque',
          url: 'https://youtube.com/watch?v=xxx',
        },
      ],
      articles: [
        {
          id: 'article-1',
          title: 'MPB nos anos 70',
          source: 'Revista Música Brasileira',
          url: 'https://example.com/article',
        },
      ],
    };
  }
}
