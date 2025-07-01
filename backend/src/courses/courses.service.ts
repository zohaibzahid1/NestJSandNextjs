import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/entities/users.entity';
import { Enrollment } from 'src/entities/enrollments.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  // create course
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);

  }
  // update course
  async updateCourse(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.preload({
      id,
      ...updateCourseDto,
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return this.courseRepository.save(course);
  }

  // get all courses
  async getActiveCourses(): Promise<Course[]> {
    return this.courseRepository.find({where:{deletedAt:IsNull()}}); // will return all courses except soft deleted courses
  }

  // get all courses including soft deleted courses
  async getAllCourses(): Promise<Course[]> {
    const courses = await this.courseRepository.find({withDeleted:true}); // will return all courses including soft deleted courses
    return courses;
  }

  // soft delete course
  async softDeleteCourse(id: number): Promise<void> {
    await this.courseRepository.softDelete(id);
    // delete all enrollments of the course
    await this.enrollmentRepository.delete({course:{id}}); // soft delete the course will not delete the enrollments of the course
  }
  // restore course
  async restoreCourse(id: number): Promise<void> {
    await this.courseRepository.restore(id);
  }
  // hard delete course
  async hardDeleteCourse(id: number): Promise<void> {
    await this.courseRepository.delete(id); // since we are using onDelete:CASCADE in the enrollments entity, this will also delete the enrollments of a course
  }
}
