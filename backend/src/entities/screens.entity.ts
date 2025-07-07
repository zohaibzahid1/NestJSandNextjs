import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Cinemas } from './cinemas.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Seats } from './seat.entity';

@ObjectType()
@Entity()
export class Screens {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    totalSeats: number;

    @Column()
    @Field()
    totalBooked: number;

    @Column()
    @Field()
    totalRemaining: number;

    @OneToMany(() => Seats, (seat) => seat.screen, {nullable:true})
    @Field(() => [Seats])
    seats: Seats[];


    @ManyToOne(() => Cinemas, (cinema) => cinema.screens)
    @Field(() => Cinemas)
    cinema: Cinemas;   
}