import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from '../entities/enrollments.entity';
import { CreateEnrollmentInput } from './dto/create-enrollment.dto';
import { UpdateGradeInput } from './dto/update-grade.dto';

@Resolver(() => Enrollment)
export class EnrollmentsResolver {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Query(() => [Enrollment])
  async getEnrollments() {
    const enrollments = await this.enrollmentsService.getEnrollments();
    console.log(enrollments);
    return enrollments;

  }
  // delete enrollment
  @Mutation(() => Boolean)
  async deleteEnrollment(@Args('id', { type: () => Int }) id: number) {
    console.log("inResolver:: ", id);
    return this.enrollmentsService.deleteEnrollment(id);
  }
  // create enrollment
  @Mutation(() => Enrollment)
  async createEnrollment(@Args('input') input: CreateEnrollmentInput) {
    return this.enrollmentsService.createEnrollment(input);
  }

  // update grade of enrollment
  @Mutation(() => Enrollment)
  async updateGrade(@Args('input') input: UpdateGradeInput) {
    
    return this.enrollmentsService.updateGrade(input);
  }
}
