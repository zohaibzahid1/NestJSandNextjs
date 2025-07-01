import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    BeforeInsert,
    BeforeUpdate,
  } from 'typeorm';
  import { User } from './users.entity';
  import { Course } from './course.entity';
  
  @Entity()
  export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE' })
    course: Course;
  
    // Automatically set when entity is inserted
    @CreateDateColumn()
    enrollmentDate: Date;
    
  
    // Will be set in lifecycle hook if grade is added
    @Column({ nullable: true })
    completionDate: Date;
  
    @Column({ nullable: true })
    grade: string;
  
    @BeforeUpdate()
    setCompletionDate() {
      if (this.grade && !this.completionDate) {
        this.completionDate = new Date();
      }
    }
  }
  