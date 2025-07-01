import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Enrollment } from 'src/entities/enrollments.entity';
import { Repository } from 'typeorm';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Course } from 'src/entities/course.entity';
import { User } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EnrollmentsService {
    constructor(
        @InjectRepository(Enrollment)
        private readonly enrollmentRepository: Repository<Enrollment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>) {}
    // get all enrollments
    async getEnrollments(): Promise<Enrollment[]> {
        const enrollments = await this.enrollmentRepository.find({
            relations: ['user', 'course']
        });
        console.log(enrollments);
        return enrollments;
    }
    // delete enrollment
    async deleteEnrollment(id: number): Promise<void> {
        await this.enrollmentRepository.delete(id);
    }
    // create enrollment
    async createEnrollment(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
        // extract userId and courseId from the createEnrollmentDto
        const {userId,courseId} = createEnrollmentDto;
        // check if user and course exist
        const user = await this.userRepository.findOne({where:{id:userId}});
        const course = await this.courseRepository.findOne({where:{id:courseId}});
        if(!user || !course){
            throw new NotFoundException('User or course not found');
        }
        // check if enrollment already exists
        const existing = await this.enrollmentRepository.findOne({
            where: { user: { id: userId }, course: { id: courseId } },
          });
        
          if(existing){
            throw new BadRequestException('Enrollment already exists');
        }
        // create enrollment
        const enrollment = this.enrollmentRepository.create({user,course});
        // save enrollment
        return this.enrollmentRepository.save(enrollment);
        
    }
    // update grade of enrollment
    async updateGrade(id: number, updateGradeDto: UpdateGradeDto): Promise<Enrollment> {
        // extract enrollmentId and grade from the updateGradeDto
        const {grade} = updateGradeDto;
        // check if enrollment exists
        const enrollment = await this.enrollmentRepository.findOne({where:{id:id}});
        if(!enrollment){
            throw new NotFoundException('Enrollment not found');
        }
        // update grade
        enrollment.grade = grade;
        // save enrollment
        return this.enrollmentRepository.save(enrollment);
    }
}
