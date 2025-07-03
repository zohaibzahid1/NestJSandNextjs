import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, DeleteDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './users.entity';
import { Enrollment } from './enrollments.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Course {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;
    
    @Field()
    @Column()
    description: string;

    @OneToMany(()=>Enrollment,(enrollment)=>enrollment.course)
    enrollments: Enrollment[];
    // created at
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field({ nullable: true })
    @DeleteDateColumn({nullable:true}) // enables soft delete
    deletedAt?: Date;
    
} 