import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // to create the app including all modules
 app.useGlobalPipes( // validates Every request as per the Dto
    new ValidationPipe({
      whitelist: true, // removes properties not in DTO
      forbidNonWhitelisted: true, // throws if extra properties are sent
      transform: true, // auto-transforms payloads to DTO instances
    }),
  );

app.use(cookieParser());
   app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],


    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
