import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
@InputType()
export class UpdateGradeInput {
    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    id: number;

    // this is the grade that we are updating the enrollment to
    @IsNotEmpty()
    @IsString()
    @Field(() => String)
    grade: string;
}