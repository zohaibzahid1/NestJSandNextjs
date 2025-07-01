import { IsString, IsNotEmpty } from 'class-validator';

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    houseNumber: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    town: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    country: string;
} 