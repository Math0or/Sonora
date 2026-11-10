import { Controller, Get, Query, Param, HttpCode } from '@nestjs/common';
import { MusicService } from './music.service.js';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  /**
   * GET /music/search?q=Construção
   * Busca músicas por título ou artista
   * v0.1: Retorna dados mockados
   * v0.2+: Busca em Spotify
   */
  @Get('search')
  @HttpCode(200)
  async search(@Query('q') query: string) {
    if (!query || query.length === 0) {
      return {
        status: 'error',
        message: 'Query parameter "q" is required',
        results: [],
      };
    }

    const results = await this.musicService.search(query);

    return {
      status: 'success',
      query,
      total: results.length,
      results,
    };
  }

  /**
   * GET /music/:id
   * Obtém detalhes de uma música específica
   * v0.1: Dados mockados
   * v0.2+: Dados do banco + Spotify
   */
  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string) {
    const music = await this.musicService.findById(id);

    if (!music) {
      return {
        status: 'error',
        message: `Music with id "${id}" not found`,
        data: null,
      };
    }

    return {
      status: 'success',
      data: music,
    };
  }

  /**
   * GET /music/:id/universe
   * Obtém o universo relacionado a uma música
   * Inclui livros, vídeos, artigos, contextos
   * v0.1: Dados mockados
   * v0.3+: Multi-source
   * v0.4+: AI-powered analysis
   */
  @Get(':id/universe')
  @HttpCode(200)
  async getUniverse(@Param('id') id: string) {
    const universe = await this.musicService.getUniverse(id);

    if (!universe.music) {
      return {
        status: 'error',
        message: `Music with id "${id}" not found`,
        data: null,
      };
    }

    return {
      status: 'success',
      data: universe,
    };
  }
}
