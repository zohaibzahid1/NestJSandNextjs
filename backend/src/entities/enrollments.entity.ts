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
  import { ObjectType, Field, ID } from '@nestjs/graphql';
  @Entity()
  @ObjectType()
  export class Enrollment {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;
    
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
    user: User;
  
    @Field(() => Course)
    @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE' })
    course: Course;
  
    // Automatically set when entity is inserted
    @CreateDateColumn()
    @Field(() => Date)
    enrollmentDate: Date;
    
  
    // Will be set in lifecycle hook if grade is added
    @Column({ nullable: true })
    @Field(() => Date, { nullable: true })
    completionDate: Date;
  
    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    grade: string;
  
    @BeforeUpdate()
    setCompletionDate() {
      if (this.grade && !this.completionDate) {
        this.completionDate = new Date();
      }
    }
  }
  