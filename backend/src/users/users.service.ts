import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';
import { Address } from 'src/entities/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { AddressInput } from './dto/address.dto';
import { Enrollment } from 'src/entities/enrollments.entity';
import { Seats } from '../entities/seat.entity';

// type for the transaction context
type TransactionContext = {
  userRepo: Repository<User>;
  addressRepo: Repository<Address>;
  enrollmentRepo: Repository<Enrollment>;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
  ) {}
  // get the transaction context
  private getTransactionContext(manager: EntityManager): TransactionContext {
    return {
      userRepo: manager.getRepository(this.usersRepo.target),
      addressRepo: manager.getRepository(this.addressRepo.target),
      enrollmentRepo: manager.getRepository(this.enrollmentRepository.target),
    };
  }
  // ----------------Authentication-----------------------

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
    await this.usersRepo.update({id:userId}, { refreshToken: token ?? undefined });
  }

  // ----------------Address--------------------------
  // save address for user and link it to user
  async saveAddress(address: AddressInput, userId: number): Promise<boolean> {
    return await this.usersRepo.manager.transaction(async (manager) => {
      // Get repositories from the transactional entity manager
      const { userRepo, addressRepo } = this.getTransactionContext(manager);
      // find the user
      const user = await userRepo.findOne({ where: { id: userId } });
      // if user not found throw error
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    // create new address
    const newAddress = addressRepo.create(address); 
    // link address to user
    user.address = newAddress;
    // save user and address
    // cascade: true will handle saving both user and address, and setting addressId
    const updatedUser = await userRepo.save(user);
      if (!updatedUser.address) {
      throw new NotFoundException(`Address not found for user with ID ${userId}`);
      }
      return true;
  });
  }

  // update address for user
  async updateAddress(address: AddressInput, userId: number): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['address'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const updatedAddress = await this.addressRepo.update(user.address!.id, address);
    
    if(updatedAddress.affected && updatedAddress.affected > 0){
      return true;
    }else{
      return false;
    }
  }

  // get address for user
  async getAddress(userId: number): Promise<Address | null> {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['address'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.address || null; 
  }

  // ----------------Users----------------------------
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
  async softDeleteUser(userId: number): Promise<boolean> {
    return await this.usersRepo.manager.transaction(async (manager) => {
      // Get repositories from the transactional entity manager
      const { userRepo, enrollmentRepo } = this.getTransactionContext(manager);

      // Soft delete the user
      const res = await userRepo.softDelete(userId);

      // Check if the soft delete affected any rows
      if (res.affected && res.affected > 0) {
        // Delete all enrollments of the user
        await enrollmentRepo.delete({ user: { id: userId } });
        return true;
      } else {
        return false;
      }
    });
  }

  // restore user
  async restoreUser(userId: number): Promise<boolean> {
    const res = await this.usersRepo.restore(userId);

    if(res.affected && res.affected > 0){
      return true;
    }else{
      return false;
    }
  }

  // NOTE Cascade only works if the entity is fully loaded from the database

  // hard delete user
  async hardDeleteUser(userId: number): Promise<boolean> {
    return await this.usersRepo.manager.transaction(async (manager) => {
      // Get repositories from the transactional entity manager
      const { userRepo, enrollmentRepo, addressRepo } = this.getTransactionContext(manager);
  
      // Find the user, including soft-deleted ones
      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['address'],
        withDeleted: true,
      });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      
  
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
      return true;
    });
  }

  async getUserBookings(userId: number): Promise<Seats[]> {
    return this.seatsRepository.find({ where: { user: { id: userId } }, relations: ['screen'] });
  }
}
  

