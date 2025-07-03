import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { CoursesService } from "./courses.service";
import { Course } from "../entities/course.entity";
import { CreateCourseInput } from "./dto/create-course.dto";
import { UpdateCourseInput } from "./dto/update-course.dto";

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  // Create course
  @Mutation(() => Course)
  async createCourse(@Args('input') input: CreateCourseInput) {
    return this.coursesService.createCourse(input);
  }

  // Get all active courses
  @Query(() => [Course])
  async getActiveCourses() {
    return this.coursesService.getActiveCourses();
    
  }

  // Get all courses (including soft deleted)
  @Query(() => [Course])
  async getAllCourses() {
    const result = await this.coursesService.getAllCourses();
    return result;

  }

  // Soft delete course
  @Mutation(() => Boolean)
  async softDeleteCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.softDeleteCourse(id);
  }

  // Restore course
  @Mutation(() => Boolean)
  async restoreCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.restoreCourse(id);
  }

  // Hard delete course
  @Mutation(() => Boolean)
  async hardDeleteCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.hardDeleteCourse(id);
  }

  // Update course
  @Mutation(() => Course, { nullable: true })
  async updateCourse(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCourseInput
  ) {
    return this.coursesService.updateCourse(id, input);
  }
}

