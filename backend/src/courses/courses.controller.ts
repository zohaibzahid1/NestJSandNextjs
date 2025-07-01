import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
// NOTE : we are not using guards here because we are working with admin to perform opertions on all courses

// create course
  @Post('create-course')
  create(@Body() createCourseDto: CreateCourseDto) {
    console.log("courses controller create course is called");
    return this.coursesService.createCourse(createCourseDto);
  }

  // get all courses
  @Get('get-active-courses')
  async getCourses() {
    return this.coursesService.getActiveCourses();
  }
  // get all courses including soft deleted courses
  @Get('get-all-courses')
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  // soft delete course
  @Delete('soft-delete-course/:id')
  async softDeleteCourse(@Param('id') id: number) {
    return this.coursesService.softDeleteCourse(id);
    // delete all enrollments of the course
  }
  // restore course
  @Patch('restore-course/:id')
  async restoreCourse(@Param('id') id: number) {
    return this.coursesService.restoreCourse(id);
  }
  // hard delete course
  @Delete('hard-delete-course/:id')
  async hardDeleteCourse(@Param('id') id: number) {
    return this.coursesService.hardDeleteCourse(id);
  } 
  // update course
  @Patch('update-course/:id')
  async updateCourse(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }
}
