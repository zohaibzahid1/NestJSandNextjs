import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screens } from '../entities/screens.entity';
import { Cinemas } from '../entities/cinemas.entity';
import { ScreensService } from './screens.service';
import { ScreensResolver } from './screens.resolver';
import { Seats } from 'src/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Screens, Cinemas, Seats])],
  providers: [ScreensService, ScreensResolver],
  exports: [ScreensService],
})
export class ScreensModule {} 