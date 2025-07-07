import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { ScreensService } from './screens.service';
import { Screens } from '../entities/screens.entity';
import { CreateScreenInput } from './dto/create-screen.input';
import { UpdateScreenInput } from './dto/update-screen.input';
import { Seats } from 'src/entities/seat.entity';

@Resolver(() => Screens)
export class ScreensResolver {
  constructor(private readonly screensService: ScreensService) {}

  @Mutation(() => Screens)
  async createScreen(
    @Args('input') input: CreateScreenInput,
  ): Promise<Screens> {
    return this.screensService.createScreen(input);
  }

  @Mutation(() => Screens)
  async updateScreen(
    @Args('input') input: UpdateScreenInput,
  ): Promise<Screens> {
    return this.screensService.updateScreen(input);
  }

  @Mutation(() => Screens)
  async resetScreen(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Screens> {
    return this.screensService.resetScreen(id);
  }

  @Query(() => Screens)
  async getScreen(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Screens> {
    return this.screensService.getScreen(id);
  }
  @Query(() => [Seats], { nullable: true })
  async getSeats(
    @Args('screenId', { type: () => Int }) screenId: number,
  ): Promise<Seats[]> {
    return this.screensService.getSeats(screenId);
  }
} 