import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/users.entity';
import { CoursesModule } from './courses/courses.module';
import { Address } from './entities/address.entity';
import { Course } from './entities/course.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { Enrollment } from './entities/enrollments.entity';
import { AboutsModule } from './aboutus/abouts.module';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({ 
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'trial_db',
      entities: [User,Address,Course,Enrollment],
      synchronize: true, // auto-create tables in dev only
    }),
    UsersModule,
    AuthModule,
     ConfigModule.forRoot({
      isGlobal: true,
    }),
     CoursesModule,
     EnrollmentsModule,
     AboutsModule,
  ],
})
export class AppModule {}
