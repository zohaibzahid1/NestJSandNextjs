import { IsEmail, IsNumber } from 'class-validator';
export class UserDto {
    @IsNumber()
    id: number;
    @IsEmail()
    email: string;
    
}