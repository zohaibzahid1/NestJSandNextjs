import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
