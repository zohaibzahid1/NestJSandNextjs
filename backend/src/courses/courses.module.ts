import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { User } from 'src/entities/users.entity';
import { Enrollment } from 'src/entities/enrollments.entity';
import { CoursesResolver } from './courses.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User,Enrollment])],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesResolver],
})
export class CoursesModule {}
