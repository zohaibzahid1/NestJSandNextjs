import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { CinemasService } from './cinemas.service';
import { Cinemas } from '../entities/cinemas.entity';
import { CreateCinemaInput } from './dto/create-cinema.input';
import { Screens } from '../entities/screens.entity';

@Resolver(() => Cinemas)
export class CinemasResolver {
  constructor(private readonly cinemasService: CinemasService) {}

  @Mutation(() => Cinemas)
  async createCinema(
    @Args('input') input: CreateCinemaInput,
  ): Promise<Cinemas> {
    return this.cinemasService.createCinema(input);
  }
  

  @Query(() => [Cinemas])
  async getAllCinemas(): Promise<Cinemas[]> {
    return this.cinemasService.findAllCinemas();
  }

  @Query(() => [Screens])
  async getScreensByCinema(
    @Args('cinemaId', { type: () => Int }) cinemaId: number,
  ): Promise<Screens[]> {
    return this.cinemasService.findScreensByCinema(cinemaId);
  }
} 