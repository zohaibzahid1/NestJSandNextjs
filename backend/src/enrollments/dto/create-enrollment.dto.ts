import { IsNotEmpty, IsNumber } from "class-validator";
import { Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateEnrollmentInput {
    @Field(() => ID)
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @Field(() => ID)
    @IsNotEmpty()
    @IsNumber()
    courseId: number;
}