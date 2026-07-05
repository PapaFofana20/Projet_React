import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
  ) {}

  /**
   * Récupérer tous les cinémas
   */
  async findAll(): Promise<Cinema[]> {
    return this.cinemaRepository.find({
      relations: ['halls'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Récupérer un cinéma par ID
   */
  async findOne(id: number): Promise<Cinema> {
    const cinema = await this.cinemaRepository.findOne({
      where: { id },
      relations: ['halls', 'halls.seatLayouts'],
    });

    if (!cinema) {
      throw new NotFoundException(`Cinéma avec l'ID ${id} non trouvé`);
    }

    return cinema;
  }

  /**
   * Récupérer les cinémas par ville
   */
  async findByCity(city: string): Promise<Cinema[]> {
    return this.cinemaRepository.find({
      where: { city, isActive: true },
      relations: ['halls'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Créer un nouveau cinéma
   */
  async create(data: Partial<Cinema>): Promise<Cinema> {
    const cinema = this.cinemaRepository.create(data);
    return this.cinemaRepository.save(cinema);
  }

  /**
   * Mettre à jour un cinéma
   */
  async update(id: number, data: Partial<Cinema>): Promise<Cinema> {
    const cinema = await this.findOne(id);
    Object.assign(cinema, data);
    return this.cinemaRepository.save(cinema);
  }

  /**
   * Supprimer un cinéma (soft delete en mettant isActive à false)
   */
  async remove(id: number): Promise<void> {
    const cinema = await this.findOne(id);
    cinema.isActive = false;
    await this.cinemaRepository.save(cinema);
  }
}
