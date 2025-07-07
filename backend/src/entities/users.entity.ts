import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn,DeleteDateColumn , JoinTable, OneToMany, CreateDateColumn } from 'typeorm';
import { Address } from './address.entity';
import { Enrollment } from './enrollments.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Seats } from './seat.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn() 
  id: number; // Unique identifier for the user

  @Field(() => String)
  @Column({ unique: true }) 
  email: string; // User's email address, must be unique
  
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  password?: string; // User's password, optional for social logins

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  googleId?: string; // Google OAuth ID, optional for social logins

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  refreshToken?: string; // Hashed refresh token for the user, optional

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  firstName?: string; // User's first name, optional

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName?: string; // User's last name, optional
  
  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({nullable:true}) // enables soft delete
  deletedAt?: Date;
  // created at
  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  createdAt: Date;
  
  // --------------------------------------------------------------
  // for Database Relations

  @OneToOne(() => Address, (address) => address.user, {nullable:true,cascade:true})
  @JoinColumn() // This means that this is the owner side of relation and holds the foreign key
  address?: Address|null; // null is used to indicate that the address is not set
  
  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => Seats, (seat) => seat.user, {nullable:true})
  seats: Seats[];

  // GraphQl Schema specific fields

  @Field(() => String, { nullable: true })
  addressId : String;
  
  // Make relationships with other entities 
}
