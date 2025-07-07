import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seats } from '../entities/seat.entity';
import { Screens } from '../entities/screens.entity';
import { User } from '../entities/users.entity';
import { SeatsService } from './seats.service';
import { SeatsResolver } from './seats.resolver';
import { BookSeatInput } from './dto/book-seat.input';

@Module({
  imports: [TypeOrmModule.forFeature([Seats, Screens, User]),BookSeatInput,],
  providers: [SeatsService, SeatsResolver],
  exports: [SeatsService],
})
export class SeatsModule {} 