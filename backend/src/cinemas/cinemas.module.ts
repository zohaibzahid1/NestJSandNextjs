import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinemas } from '../entities/cinemas.entity';
import { Screens } from '../entities/screens.entity';
import { CinemasService } from './cinemas.service';
import { CinemasResolver } from './cinemas.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Cinemas, Screens])],
  providers: [CinemasService, CinemasResolver],
  exports: [CinemasService],
})
export class CinemasModule {} 