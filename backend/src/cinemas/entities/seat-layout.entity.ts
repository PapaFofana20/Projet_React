import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Hall } from './hall.entity';

/**
 * Type de siège dans une salle
 */
export enum SeatType {
  STANDARD = 'standard',
  VIP = 'vip',
  HANDICAPPED = 'handicapped',
  COUPLE = 'couple',
}

/**
 * Statut du siège
 */
export enum SeatStatus {
  AVAILABLE = 'available',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
}

/**
 * Interface pour la configuration d'un siège dans la grille
 */
export interface SeatConfig {
  type: SeatType | string;
  status: SeatStatus | string;
}

/**
 * Disposition des sièges - Représente la grille complète des sièges dans une salle
 * Stocke la configuration complète incluant les types de sièges et leurs positions
 */
@Entity('seat_layouts')
export class SeatLayout {
  @ApiProperty({ description: 'Identifiant unique' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID de la salle parente' })
  @Column({ name: 'hall_id' })
  hallId: number;

  @ApiProperty({ description: 'Salle parente' })
  @ManyToOne(() => Hall, (hall) => hall.seatLayouts, { eager: false })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  /**
   * Grille des sièges au format JSON
   * Structure: { "A1": { "type": "standard" }, "A2": { "type": "vip" }, ... }
   * Chaque siège a:
   * - type: standard | vip | handicapped | couple
   * - status: available | blocked | maintenance
   */
  @ApiProperty({
    description: 'Configuration JSON de la grille des sièges',
    example: { A1: { type: 'standard', status: 'available' } },
  })
  @Column({ type: 'simple-json' })
  seatGrid: Record<string, SeatConfig>;

  /**
   * Liste des sièges VIP (format: ["A1", "A2", "B1", ...])
   * Pour un accès rapide lors de la réservation
   */
  @ApiProperty({ description: 'Liste des sièges VIP' })
  @Column({ type: 'simple-json', nullable: true, name: 'vip_seats' })
  vipSeats: string[];

  /**
   * Liste des sièges_handicapés
   */
  @ApiProperty({ description: 'Liste des siègeshandicapés' })
  @Column({ type: 'simple-json', nullable: true, name: 'handicapped_seats' })
  handicappedSeats: string[];

  /**
   * Liste des sièges Couples
   */
  @ApiProperty({ description: 'Liste des sièges couple' })
  @Column({ type: 'simple-json', nullable: true, name: 'couple_seats' })
  coupleSeats: string[];

  /**
   * Sièges bloqués (pour maintenance ou autres raisons)
   */
  @ApiProperty({ description: 'Sièges temporairement bloqués' })
  @Column({ type: 'simple-json', nullable: true })
  blockedSeats: string[];
}
