import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategyBase, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

/**
 * Passport strategy for handling refresh tokens in NestJS using JWT.
 * This strategy extracts the refresh token from a secure HTTP-only cookie.
 */
@Injectable()
export class RefreshStrategy extends PassportStrategy(JwtStrategyBase, 'refresh') {
  constructor() {
    super({
      // Custom extractor to pull refresh_token from cookies
      jwtFromRequest: (req: Request) => {
        if (!req || !req.cookies) return null;
        return req.cookies['refresh_token'];
      },
      // Secret used to validate refresh token signature
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  /**
   * This method runs after the refresh token is verified.
   * The payload is the decoded JWT content.
   */

  async validate(payload: any): Promise<{ userId: string; email: string }> {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
