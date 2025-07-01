import {
    Controller,
    Post,
    Get,
    Req,
    Res,
    UseGuards,
    Body,
    ForbiddenException,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { AuthService } from './auth.service';
  import { AuthGuard } from '@nestjs/passport';
  import { RefreshGuard } from '../guards/jwt-refresh.guard';
  import { JwtGuard } from '../guards/jwt-auth.guard';
  import { CreateUserDto } from 'src/users/dto/create-user.dto';
  import { UserDto } from './dto/user.dto';
  import { verify } from 'jsonwebtoken';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
    private readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
    // Login with local strategy
    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
      try {
        const auth = await this.authService.handleTokenAndCookies(req.user, res);
  
        return {
          message: 'Login successful',
          user: auth.user,
          accessToken: auth.tokens.accessToken,
        };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }
  
    // Google OAuth2 entry point
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
      // Guard handles redirection
    }
  
    // Google OAuth2 callback
    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req, @Res() res: Response) {
      await this.authService.handleTokenAndCookies(req.user, res);
      return res.redirect(`${process.env.FRONTEND_URL}/login?success=true`);
    }
  
    // Refresh JWT access token
    @Post('refresh')
    @UseGuards(RefreshGuard)
    async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
      try {
        const oldToken = req.cookies['refresh_token'];
        const user = req.user;
  
        const isValid = await this.authService.validateRefreshToken(user.userId, oldToken);
        if (!isValid) {
          console.log('Invalid refresh token for user:', user.email);
          throw new ForbiddenException('Invalid refresh token');
        }
  
        const userForTokens = new UserDto();
        userForTokens.id = user.userId;
        userForTokens.email = user.email;
  
        const auth = await this.authService.refreshAccessToken(userForTokens, res);
  
        return {
          message: 'Tokens refreshed successfully',
          accessToken: auth.accessToken,
        };
      } catch (error) {
        console.error('Refresh error:', error.message);
        throw error;
      }
    }
  
    // Logout user and clear refresh token
    @Post('logout')
    @UseGuards(JwtGuard)
    async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
      const userId = req.user.userId;
  
      await this.authService.removeRefreshToken(userId);
  
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'strict',
        path: '/',
      });
  
      return res.status(200).json({
        message: 'Logout successful',
      });
    }
  
    // Register new user
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
      const result = await this.authService.register(createUserDto, res);
  
      return {
        message: 'Registration successful',
        user: result.user,
        accessToken: result.accessToken,
      };
    }
    @Post('verify-token')
    async verifyToken(@Body() body: { token: string },@Res({passthrough:true}) res:Response) {
      const token = body.token;
      try{
      const decoded = verify(token,this.JWT_ACCESS_SECRET);
      res.status(200).json({ message: 'Token verified successfully',decoded });
    }catch(err){
      res.status(401).json({ message: 'Invalid token' });
    }
  } 
}
  