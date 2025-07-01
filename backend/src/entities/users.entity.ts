import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn,DeleteDateColumn , JoinTable, OneToMany, CreateDateColumn } from 'typeorm';
import { Address } from './address.entity';
import { Course } from './course.entity';
import { Enrollment } from './enrollments.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn() 
  id: number; // Unique identifier for the user

  @Column({ unique: true }) 
  email: string; // User's email address, must be unique

  @Column({ nullable: true })
  password?: string; // User's password, optional for social logins

  @Column({ nullable: true })
  googleId?: string; // Google OAuth ID, optional for social logins

  @Column({ nullable: true })
  refreshToken?: string; // Hashed refresh token for the user, optional

  @Column({ nullable: true })
  firstName?: string; // User's first name, optional

  @Column({ nullable: true })
  lastName?: string; // User's last name, optional

  @OneToOne(() => Address, (address) => address.user, {nullable:true,cascade:true})
  @JoinColumn() // This means that this is the owner side of relation and holds the foreign key
  address?: Address|null; // null is used to indicate that the address is not set
  
  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];
  
  @DeleteDateColumn({nullable:true}) // enables soft delete
  deletedAt?: Date;
  // created at
  @CreateDateColumn()
  createdAt: Date;

  // Make relationships with other entities 
}
