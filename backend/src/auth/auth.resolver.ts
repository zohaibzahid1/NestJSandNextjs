import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { LocalLoginGuard } from 'src/guards/local-login.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(LocalLoginGuard)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any
  ): Promise<LoginResponse> {
    try {
      const { req, res } = context;
      const auth = await this.authService.handleTokenAndCookies(req.user.user, res);
      const loginResponse = new LoginResponse();
      loginResponse.message = 'Login successful';
      console.log("inResolver:: ", req.user.user);
      loginResponse.user = req.user.user;
      loginResponse.accessToken = auth.tokens.accessToken;
      return loginResponse;
    } catch (error) {

      console.error('Login error:', error);
      throw error;
    }
  }
}

// Define LoginResponse type for GraphQL
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {

  @Field()
  message: string;

  @Field(() => UserDto)
  user: UserDto;

  @Field()
  accessToken: string;
  
} 