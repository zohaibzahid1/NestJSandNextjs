import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/jwt-refresh.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    UsersModule, // Module for user management, providing user data and validation
    PassportModule, // Passport module for authentication strategies
    JwtModule.register({}), // JWT module for handling and issuing JSON Web Tokens
  ],
  controllers: [AuthController],
  providers: [
    AuthService, // Service for handling authentication logic
    JwtStrategy, // Strategy for validating JWT tokens
    RefreshStrategy, // Strategy for handling refresh tokens
    LocalStrategy, // Strategy for local authentication (username/password)
    GoogleStrategy, // Strategy for Google OAuth authentication
  ],
})
export class AuthModule {}