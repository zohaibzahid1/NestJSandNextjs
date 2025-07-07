import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class BookSeatInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  seatNumber: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  screenId: number;
} 