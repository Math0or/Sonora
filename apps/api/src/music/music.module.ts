import { Module } from '@nestjs/common';
import { MusicService } from './music.service.js';
import { MusicController } from './music.controller.js';

@Module({
  imports: [],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
