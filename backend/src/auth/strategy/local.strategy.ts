import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';

// Passport strategy for handling local authentication (username/password) in NestJS.

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  // it automatically extract the email and password from the request body
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    console.log("inStrategy:: ", user);
    
    if (!user) throw new UnauthorizedException('Login failed: Invalid email or password.');
    return { user };
    
  }
}
