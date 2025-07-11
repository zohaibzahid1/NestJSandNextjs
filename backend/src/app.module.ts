import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
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
import { Seats } from './entities/seat.entity';
import { Screens } from './entities/screens.entity';
import { Cinemas } from './entities/cinemas.entity';
import { CinemasModule } from './cinemas/cinemas.module';
import { ScreensModule } from './screens/screens.module';
import { SeatsModule } from './seats/seats.module';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    
    UsersModule,
    AuthModule,
     // This line initializes the ConfigModule and loads environment variables from a .env file (if present).
     // Setting isGlobal: true makes the configuration available throughout the entire application without needing to import ConfigModule in every module.
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // to use the apollo driver 
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // to generate the schema file
      playground: true, // to enable the playground
      context: ({ req, res }) => ({ req, res }), // to attach the request and response to the context
    }),
     CoursesModule,
     EnrollmentsModule,
     AboutsModule,
     CinemasModule,
     ScreensModule,
     SeatsModule,
  ],
})
export class AppModule {}
