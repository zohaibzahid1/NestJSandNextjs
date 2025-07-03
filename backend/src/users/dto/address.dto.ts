import { IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';


@InputType()
export class AddressInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    houseNumber: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    street: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    town: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    city: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    state: string;

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    country: string;
} 