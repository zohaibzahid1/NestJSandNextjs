import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinemas } from '../entities/cinemas.entity';
import { Screens } from '../entities/screens.entity';
import { CreateCinemaInput } from './dto/create-cinema.input';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinemas)
    private cinemasRepository: Repository<Cinemas>,
    @InjectRepository(Screens)
    private screensRepository: Repository<Screens>,
  ) {}

  async createCinema(input: CreateCinemaInput): Promise<Cinemas> {
    const { name, totalScreens } = input;
    try{
        const cinema = this.cinemasRepository.create({ name, totalScreens });
        const savedCinema = await this.cinemasRepository.save(cinema);
        return savedCinema;
    } catch(error){
        throw new Error(error.message);
    }
  }

  async findAllCinemas(): Promise<Cinemas[]> {
    try{
        return this.cinemasRepository.find({relations: ['screens']});
    } catch(error){
        throw new Error(error.message);
    }
  }

  async findScreensByCinema(cinemaId: number): Promise<Screens[]> {
    return this.screensRepository.find({ where: { cinema: { id: cinemaId } } });
  }
} 