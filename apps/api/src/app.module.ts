import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MusicModule } from './music/music.module.js';

@Module({
  imports: [MusicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
