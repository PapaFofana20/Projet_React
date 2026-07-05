import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hall, ScreenType } from './entities/hall.entity';
import { SeatLayout, SeatType, SeatStatus } from './entities/seat-layout.entity';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private readonly hallRepository: Repository<Hall>,
    @InjectRepository(SeatLayout)
    private readonly seatLayoutRepository: Repository<SeatLayout>,
  ) {}

  /**
   * Récupérer toutes les salles
   */
  async findAll(): Promise<Hall[]> {
    return this.hallRepository.find({
      relations: ['cinema', 'seatLayouts'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Récupérer une salle par ID
   */
  async findOne(id: number): Promise<Hall> {
    const hall = await this.hallRepository.findOne({
      where: { id },
      relations: ['cinema', 'seatLayouts'],
    });

    if (!hall) {
      throw new NotFoundException(`Salle avec l'ID ${id} non trouvée`);
    }

    return hall;
  }

  /**
   * Récupérer les salles par cinéma
   */
  async findByCinema(cinemaId: number): Promise<Hall[]> {
    return this.hallRepository.find({
      where: { cinemaId, isActive: true },
      relations: ['seatLayouts'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Créer une nouvelle salle avec génération automatique de la grille de sièges
   */
  async create(data: {
    cinemaId: number;
    name: string;
    capacity: number;
    rowCount: number;
    seatsPerRow: number;
    screenType: ScreenType;
    basePrice: number;
    vipPrice?: number;
    description?: string;
    vipRows?: number; // Nombre de rangées VIP (par défaut 2 dernières)
  }): Promise<Hall> {
    // Créer la salle
    const hall = this.hallRepository.create(data);
    const savedHall = await this.hallRepository.save(hall);

    // Générer automatiquement la grille de sièges
    const seatGrid: Record<string, { type: string; status: string }> = {};
    const vipSeats: string[] = [];
    const standardSeats: string[] = [];

    const vipRowCount = data.vipRows || 2;

    for (let row = 0; row < data.rowCount; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C, ...

      for (let seat = 1; seat <= data.seatsPerRow; seat++) {
        const seatId = `${rowLetter}${seat}`;
        const isVip = row >= data.rowCount - vipRowCount;

        seatGrid[seatId] = {
          type: isVip ? SeatType.VIP : SeatType.STANDARD,
          status: SeatStatus.AVAILABLE,
        };

        if (isVip) {
          vipSeats.push(seatId);
        } else {
          standardSeats.push(seatId);
        }
      }
    }

    // Sauvegarder la disposition des sièges
    const seatLayout = this.seatLayoutRepository.create({
      hallId: savedHall.id,
      seatGrid,
      vipSeats,
    });

    await this.seatLayoutRepository.save(seatLayout);

    return this.findOne(savedHall.id);
  }

  /**
   * Mettre à jour une salle
   */
  async update(id: number, data: Partial<Hall>): Promise<Hall> {
    const hall = await this.findOne(id);
    Object.assign(hall, data);
    return this.hallRepository.save(hall);
  }

  /**
   * Supprimer une salle
   */
  async remove(id: number): Promise<void> {
    const hall = await this.findOne(id);
    hall.isActive = false;
    await this.hallRepository.save(hall);
  }

  /**
   * Récupérer la disposition des sièges pour une salle
   */
  async getSeatLayout(hallId: number): Promise<SeatLayout> {
    const seatLayout = await this.seatLayoutRepository.findOne({
      where: { hallId },
    });

    if (!seatLayout) {
      throw new NotFoundException(`Disposition des sièges non trouvée pour la salle ${hallId}`);
    }

    return seatLayout;
  }

  /**
   * Mettre à jour un siège spécifique
   */
  async updateSeat(
    hallId: number,
    seatId: string,
    status: string,
  ): Promise<SeatLayout> {
    const seatLayout = await this.getSeatLayout(hallId);

    if (seatLayout.seatGrid[seatId]) {
      seatLayout.seatGrid[seatId].status = status;
      await this.seatLayoutRepository.save(seatLayout);
    }

    return seatLayout;
  }
}
