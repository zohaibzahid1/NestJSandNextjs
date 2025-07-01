import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';
import { Address } from 'src/entities/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { AddressDto } from './dto/address.dto';
import { Enrollment } from 'src/entities/enrollments.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  //  Register new user with hashed password
  async createLocalUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, address: addressData } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let address: Address | undefined = undefined;
    if (addressData) {
      address = this.addressRepo.create(addressData);
    }

    const user = this.usersRepo.create({
      email,
      password: hashedPassword,
      address,
    });
    return this.usersRepo.save(user); // Only save user, address will be saved via cascade
  }

  //  Find by email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  //  Find by ID
  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  //  Find by Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { googleId },withDeleted:true });
  }

  //  Find or create user via Google OAuth
  async findOrCreateOAuthUser(data: { googleId: string; email: string ,firstName:string,lastName:string }): Promise<User> {
    let user = await this.findByGoogleId(data.googleId);
    console.log(user);
    if (!user) {
      // Check if user exists by email and link Google ID
      user = await this.findByEmail(data.email);

      if (user) { // if user exists by email then link google id to it
        user.googleId = data.googleId;
        return this.usersRepo.save(user);
      }

      // Create new user with Google ID
      user = this.usersRepo.create({
        email: data.email,
        googleId: data.googleId,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await this.usersRepo.save(user);
    }

    return user;
  }

  // 🔄 Store hashed refresh token
  async updateRefreshToken(userId: number, token: string | null): Promise<void> {
    await this.usersRepo.update(userId, { refreshToken: token ?? undefined });
  }
  // save address for user and link it to user
  async saveAddress(address: AddressDto, userId: number): Promise<Address> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    const newAddress = this.addressRepo.create(address); 
  
    user.address = newAddress;
  
    // cascade: true will handle saving both user and address, and setting addressId
    const updatedUser = await this.usersRepo.save(user);
      if (!updatedUser.address) {
      throw new NotFoundException(`Address not found for user with ID ${userId}`);
      }
    return updatedUser.address; // return the saved address (now with ID)
  }

  // update address for user
  async updateAddress(address: AddressDto, userId: number): Promise<any> {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['address'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const updatedAddress = await this.addressRepo.update(user.address!.id, address);
    return updatedAddress
  }

  // get address for user
  async getAddress(userId: number): Promise<any> {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['address'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    console.log(user.address);
    
    return user.address;
  }
  // get all active users
  async getActiveUsers(): Promise<User[]> {
    return this.usersRepo.find({where:{deletedAt:IsNull()}}); // will return all users except soft deleted users
  }
  // get all users including soft deleted users
  async getAllUsers(): Promise<User[]> {
    return this.usersRepo.find({
      withDeleted: true,
    }); // will return all users including soft deleted users
  }
  // soft delete user
  async softDeleteUser(userId: number): Promise<void> {
    await this.usersRepo.softDelete(userId);
    // delete all enrollments of the user
    await this.enrollmentRepository.delete({user:{id:userId}}); // soft delete the user will not delete the enrollments of the user 

  }
  // restore user
  async restoreUser(userId: number): Promise<void> {
    await this.usersRepo.restore(userId);
  }
  

  // NOTE Cascade only works if the entity is fully loaded from the database

  // hard delete user
  
  async hardDeleteUser(userId: number): Promise<void> {
    await this.usersRepo.manager.transaction("SERIALIZABLE", async (manager) => {
      // Get repositories from the transactional entity manager
      const userRepo = manager.getRepository(this.usersRepo.target); // get the repository of type User which is the same as injected in the constructor
      const enrollmentRepo = manager.getRepository(this.enrollmentRepository.target);
      const addressRepo = manager.getRepository(this.addressRepo.target);
  
      // Find the user, including soft-deleted ones
      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['address'],
        withDeleted: true,
      });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      // Delete all enrollments of the user
      await enrollmentRepo.delete({ user: { id: userId } });
  
      // Delete the address if present
      if (user.address) {
        const addressId = user.address.id;
  
        // Remove the address reference from the user
        user.address = null;
        await userRepo.save(user);
  
        // Delete the address
        await addressRepo.delete(addressId);
      }
  
      // Hard delete the user
      await userRepo.remove(user);
    });
  }
  
  }
  

