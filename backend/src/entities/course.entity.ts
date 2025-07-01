import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, DeleteDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './users.entity';
import { Enrollment } from './enrollments.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    

    @Column()
    description: string;

    @OneToMany(()=>Enrollment,(enrollment)=>enrollment.course)
    enrollments: Enrollment[];
    // created at
    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({nullable:true}) // enables soft delete
    deletedAt?: Date;
} 