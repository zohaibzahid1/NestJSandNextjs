import { Controller, Delete, Get, Param, Post ,Body, Patch} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentInput } from './dto/create-enrollment.dto';
import { UpdateGradeInput } from './dto/update-grade.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // NOTE : we are not using guards here because we are working with admin to perform opertions on all enrollments
  // get all enrollments
  @Get('get-enrollments')
  async getEnrollments() {
    return this.enrollmentsService.getEnrollments();
  }
  // delete enrollment
  @Delete('delete-enrollment/:id')
  async deleteEnrollment(@Param('id') id: number) {
    return this.enrollmentsService.deleteEnrollment(id);
    
  }
  // create enrollment
  @Post('create-enrollment')
  async createEnrollment(@Body() createEnrollmentDto: CreateEnrollmentInput) {
    return this.enrollmentsService.createEnrollment(createEnrollmentDto);
  }
    // update grade of enrollment
    @Patch('update-grade/:id')
    async updateGrade(@Param('id') id: number, @Body() updateGradeDto: UpdateGradeInput) {
      return this.enrollmentsService.updateGrade( updateGradeDto);
    }
}
