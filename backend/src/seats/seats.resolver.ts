import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { Seats } from '../entities/seat.entity';
import { BookSeatInput } from './dto/book-seat.input';
import { JwtGuard } from '../guards/jwt-auth.guard';

@Resolver(() => Seats)
export class SeatsResolver {
  constructor(private readonly seatsService: SeatsService) {}

  @Mutation(() => Seats)
  @UseGuards(JwtGuard)
  async bookSeat(
    @Args('input') input: BookSeatInput,
    @Context() context,
  ): Promise<Seats> {
    const userId = context.req.user.userId;
    return this.seatsService.bookSeat(input, userId);
    
  }
} 