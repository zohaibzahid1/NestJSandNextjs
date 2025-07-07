import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screens } from '../entities/screens.entity';
import { CreateScreenInput } from './dto/create-screen.input';
import { UpdateScreenInput } from './dto/update-screen.input';
import { Cinemas } from '../entities/cinemas.entity';
import { Seats } from 'src/entities/seat.entity';

@Injectable()
export class ScreensService {
  constructor(
    @InjectRepository(Screens)
    private screensRepository: Repository<Screens>,
    @InjectRepository(Cinemas)
    private cinemasRepository: Repository<Cinemas>,
    @InjectRepository(Seats)
    private seatsRepository: Repository<Seats>,
  ) {}

  async createScreen(input: CreateScreenInput): Promise<Screens> {
    try{
    const cinema = await this.cinemasRepository.findOne({ where: { id: input.cinemaId } });
    if (!cinema) throw new NotFoundException('Cinema not found');
    const screen = this.screensRepository.create({
      name: input.name,
      totalSeats: input.totalSeats,
      totalBooked: 0,
      totalRemaining: input.totalSeats,
      cinema,
    });
    return this.screensRepository.save(screen);
    } catch(error){
        throw new Error(error.message);
    }
  }

  async updateScreen(input: UpdateScreenInput): Promise<Screens> {
    try{
    const screen = await this.screensRepository.findOne({ where: { id: input.id } });
    if (!screen) throw new NotFoundException('Screen not found');
    Object.assign(screen, input);
    return this.screensRepository.save(screen);
    } catch(error){
        throw new Error(error.message);
    }
  }

  async resetScreen(id: number): Promise<Screens> { 
    try{
    const screen = await this.screensRepository.findOne({ where: { id } });
    if (!screen) throw new NotFoundException('Screen not found');
    screen.totalBooked = 0;
    screen.totalRemaining = screen.totalSeats;
    return this.screensRepository.save(screen);
    } catch(error){
        throw new Error(error.message);
    }
  }

  async getScreen(id: number): Promise<Screens> {
    try{
        const screen = await this.screensRepository.findOne({ where: { id }, relations: ['cinema', 'seats'] });
        if (!screen) throw new NotFoundException('Screen not found');
        return screen;
    } catch(error){
        throw new Error(error.message);
    }
  }
  async getSeats(screenId: number): Promise<Seats[]> {
    
    try{
        const seats = await this.seatsRepository.find({ where: { screen: { id: screenId } }, relations: ['user'], withDeleted: true });
        return seats;
    } catch(error){
        throw new Error(error.message);
    }
  }
} 