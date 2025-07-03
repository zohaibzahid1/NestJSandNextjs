import { PartialType, InputType, Field } from '@nestjs/graphql';
import { CreateCourseInput } from './create-course.dto';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {}

// Keep the original DTO for REST/validation if needed
import { PartialType as MappedPartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends MappedPartialType(CreateCourseDto) {}

