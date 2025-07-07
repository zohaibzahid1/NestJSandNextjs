import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateScreenInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  totalSeats?: number;

  @Field(() => Int, { nullable: true })
  totalBooked?: number;

  @Field(() => Int, { nullable: true })
  totalRemaining?: number;
} 