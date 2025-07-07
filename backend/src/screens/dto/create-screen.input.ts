import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, Min, MaxLength } from 'class-validator';

@InputType()
export class CreateScreenInput {
  @Field()
  @IsString()
  @MaxLength(100)
  name: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  totalSeats: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cinemaId: number;
} 