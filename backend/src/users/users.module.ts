import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/users.entity';
import { Address } from 'src/entities/address.entity';
import { UsersController } from './users.controller';
import { Enrollment } from 'src/entities/enrollments.entity';
import { Course } from 'src/entities/course.entity';
import { UsersResolver } from './users.resolver';
import { Seats } from 'src/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address,Enrollment,Course,Seats])],
  providers: [UsersService,UsersResolver],
  exports: [UsersService],
  controllers: [UsersController],
})

export class UsersModule {}
