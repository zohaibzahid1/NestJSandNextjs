// is a class that represents the address of a user in detail 
// is an example of one to one relationship 
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './users.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Address {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    houseNumber: string;

    @Field(() => String)
    @Column()
    street: string;

    @Field(() => String)
    @Column()
    town: string;

    @Field(() => String)
    @Column()
    city: string;

    @Field(() => String)
    @Column()
    state: string;

    @Field(() => String)
    @Column()
    country: string;


    
 // DATA RELATIONSHIP    
    @OneToOne(() => User, (user) => user.address)
    user: User;

}