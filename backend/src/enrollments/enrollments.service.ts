import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Enrollment } from 'src/entities/enrollments.entity';
import { Repository } from 'typeorm';
import { UpdateGradeInput } from './dto/update-grade.dto';
import { CreateEnrollmentInput } from './dto/create-enrollment.dto';
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
    async deleteEnrollment(id: number): Promise<boolean> {
        try{
            console.log("inService:: ", id);
            const result = await this.enrollmentRepository.delete(id);
            if(result.affected === 0){
                return false;
            }
                return true;
        }catch(error){
            console.log(error);
            return false;
        }
    }
    // create enrollment
    async createEnrollment(createEnrollmentDto: CreateEnrollmentInput): Promise<Enrollment> {
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
        const savedEnrollment = await this.enrollmentRepository.save(enrollment);
        console.log("inService:: ", savedEnrollment);

        return savedEnrollment;

    }
    // update grade of enrollment
    async updateGrade(updateGradeDto: UpdateGradeInput): Promise<Enrollment> {
        // extract enrollmentId and grade from the updateGradeDto
        const {id,grade} = updateGradeDto;
        // check if enrollment exists
        const enrollment = await this.enrollmentRepository.findOne({where:{id:id}, relations: ['user', 'course']});
        if(!enrollment){
            throw new NotFoundException('Enrollment not found');
        }
        // update grade
        enrollment.grade = grade;
        // save enrollment
        const savedEnrollment = await this.enrollmentRepository.save(enrollment);
        
        return savedEnrollment;
    }
}
