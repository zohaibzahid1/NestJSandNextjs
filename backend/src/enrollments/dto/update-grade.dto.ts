import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class UpdateGradeDto {
    
    // this is the grade that we are updating the enrollment to
    @IsNotEmpty()
    @IsString()
    grade: string;
}