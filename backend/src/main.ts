import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

async function bootstrap() {
   // to create the app including all modules
  const app = await NestFactory.create(AppModule);
  
  // to validate the request body as per the Dto  
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true, // removes properties not in DTO
      forbidNonWhitelisted: true, // throws if extra properties are sent
      transform: true, // auto-transforms payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // auto-converts string to number
        
      },
    }),
  );
  // to parse the cookies from the request
   app.use(cookieParser());
   // to enable the cors
   app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://192.168.23.34:3001',
      process.env.FRONTEND_URL // in case it's set to something else
    ],
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  //
  

  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
