// is a class that represents the address of a user in detail 
// is an example of one to one relationship 
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './users.entity';
@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    houseNumber: string;
    @Column()
    street: string;
    @Column()
    town: string;
    @Column()
    city: string;
    @Column()
    state: string;
    @Column()
    country: string;
    
    @OneToOne(() => User, (user) => user.address)
    user: User;

}