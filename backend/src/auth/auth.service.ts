import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { User } from "src/entities/users.entity";
import { Response } from "express";
import { UserDto } from "./dto/user.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
@Injectable()
export class AuthService {
  constructor(
    // Injecting necessary services for authentication
    private jwtService: JwtService, // JWT service for signing and verifying tokens
    private usersService: UsersService, // Service for user management, providing user data and validation
  ) {}
   // Validates a user's email and password (for local login).
  async validateUser(email: string, password: string): Promise<User | null> {
    
    const user = await this.usersService.findByEmail(email);

    if (!user) {
        console.log('User not found:', email);
      return null;
    }

    if (!user.password) {
      console.log('User has no password (likely social login):', email);
      return null;
    }

    // NOTE: Replace with bcrypt.compare when storing hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? user : null;
  }

  //  Generates tokens for a given user.
  async generateTokens(user: UserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  
   // Stores the hashed refresh token in the database.
  async storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshToken(userId, hashed);
  }


   // Validates a refresh token against the stored hash.
  async validateRefreshToken(userId: number, token: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) return false;

    return await bcrypt.compare(token, user.refreshToken);
  }

   // Removes a refresh token (e.g., on logout).
  async removeRefreshToken(userId: number): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  // Handles authentication response: sets cookies and returns token + user info. 
  // This method is called after successful login or token refresh (if implemtned in future)  
  async handleTokenAndCookies(user: UserDto, res: Response) {
    // generate tokens for the user
    const tokens = await this.generateTokens(user);

    // Store refresh token after hashing in DB
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    // set auth cookies
    this.setAuthCookies(res, tokens);

    return {
      tokens,
      user,
    };
  }
  // set auth cookies
  async setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    // Set refresh token as a secure, HTTP-only cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      
    });
    // Set access token (optional in cookie)
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
      
    });
  }

  // This method will Generate a new access token for the user when old one is expired
  async refreshAccessToken(user: UserDto, res: Response): Promise<{ accessToken: string }> {
    
    // Generate new access token
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email }, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    // Set new access token cookie
    res.cookie('access_token', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',


    });
    return { accessToken };
  } 

  // create new user 
  async register(createUserDto: CreateUserDto,res:Response): Promise<any> {

    // check if user already exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // create user
    const user = await this.usersService.createLocalUser(createUserDto);
    // generate tokens for the user
    const tokens = await this.generateTokens(user);
    // set auth cookies
    await this.setAuthCookies(res, tokens);

    // store refresh token in the database
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    // return the user and tokens
    return {
      id: user.id,
      email: user.email,
      accessToken: tokens.accessToken,
    };
  }

  // NOTE: the createUserDto data is validated by the class validator and class transformer
}
