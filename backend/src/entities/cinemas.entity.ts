import { Entity, PrimaryGeneratedColumn, Column, OneToMany,  } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Screens } from './screens.entity';
@Entity()
@ObjectType()
export class Cinemas {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Column()
    @Field()
    name: string;
    
   @Column()
   @Field()
   totalScreens: number;

   @OneToMany(() => Screens, (screen) => screen.cinema, {nullable:true})
   @Field(() => [Screens])
   screens: Screens[];
}
