import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Screens } from './screens.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './users.entity';

@ObjectType()
@Entity()
export class Seats {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column()
    @Field()
    seatNumber: number;
 
    @ManyToOne(() => Screens, (screen) => screen.seats)
    @Field(() => Screens)
    screen: Screens;

    @ManyToOne(() => User, (user) => user.seats, {nullable:true, onDelete: 'CASCADE'})
    @Field(() => User, {nullable:true})
    user: User;
}