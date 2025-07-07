import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seats } from '../entities/seat.entity';
import { Screens } from '../entities/screens.entity';
import { User } from '../entities/users.entity';
import { BookSeatInput } from './dto/book-seat.input';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
    @InjectRepository(Screens)
    private screensRepository: Repository<Screens>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
  async bookSeat(input: BookSeatInput, userId: number): Promise<Seats> {
    return await this.seatsRepository.manager.transaction(async (manager) => {
      const screensRepo = manager.getRepository(Screens);
      const seatsRepo = manager.getRepository(Seats);
      const usersRepo = manager.getRepository(User);

      console.log("userId", userId);
      const screen = await screensRepo.findOne({ where: { id: input.screenId } });
      if (!screen) throw new NotFoundException('Screen not found');
      
      // seat wont exsit in db until it is booked
      let seat = await seatsRepo.findOne({ where: { screen: { id: input.screenId }, seatNumber: input.seatNumber } });
      if (!seat) {
        // Create seat if it doesn't exist
        seat = seatsRepo.create({ screen, seatNumber: input.seatNumber });
      }
      console.log("seat", seat);

      if (seat.user && seat.user.id === userId) {
        throw new BadRequestException('You have already booked this seat');
      }
      if (seat.user) {
        throw new BadRequestException('Seat already booked');
      }
      // increment the totalBooked of the screen and totalRemaining of the screen 
      screen.totalBooked++;
      screen.totalRemaining--;
      await screensRepo.save(screen);
      const user = await usersRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      seat.user = user;
      return seatsRepo.save(seat);
    });
  }
} 