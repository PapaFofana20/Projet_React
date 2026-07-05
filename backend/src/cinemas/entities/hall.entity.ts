import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cinema } from './cinema.entity';
import { SeatLayout } from './seat-layout.entity';
import { Session } from '../../sessions/entities/session.entity';

/**
 * Type décran disponible dans les salles
 */
export enum ScreenType {
  TWO_D = '2D',
  THREE_D = '3D',
  IMAX = 'IMAX',
  DOLBY_ATMOS = 'Dolby Atmos',
  VIP = 'VIP',
}

/**
 * Entité Salle (Hall) - Représente une salle de projection dans un cinéma
 * Chaque salle a une capacité, un type décran et une grille de sièges
 */
@Entity('halls')
export class Hall {
  @ApiProperty({ description: 'Identifiant unique de la salle' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID du cinéma parent' })
  @Column({ name: 'cinema_id' })
  cinemaId: number;

  @ApiProperty({ description: 'Cinéma parent' })
  @ManyToOne(() => Cinema, (cinema) => cinema.halls, { eager: false })
  @JoinColumn({ name: 'cinema_id' })
  cinema: Cinema;

  @ApiProperty({ description: 'Nom de la salle (ex: Salle 1, Salle VIP)' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: 'Capacité totale de la salle' })
  @Column({ type: 'int' })
  capacity: number;

  @ApiProperty({ enum: ScreenType, description: 'Type décran' })
  @Column({
    type: 'enum',
    enum: ScreenType,
    default: ScreenType.TWO_D,
  })
  screenType: ScreenType;

  @ApiProperty({ description: 'Nombre de rangées de sièges' })
  @Column({ type: 'int', name: 'row_count' })
  rowCount: number;

  @ApiProperty({ description: 'Nombre de sièges par rangée' })
  @Column({ type: 'int', name: 'seats_per_row' })
  seatsPerRow: number;

  @ApiProperty({ description: 'Prix de base pour cette salle (FCFA)' })
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_price' })
  basePrice: number;

  @ApiProperty({ description: 'Prix VIP pour cette salle (FCFA)' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'vip_price' })
  vipPrice: number;

  @ApiProperty({ description: 'Description de la salle' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'La salle est-elle active ?' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Dispositions des sièges' })
  @OneToMany(() => SeatLayout, (seatLayout) => seatLayout.hall)
  seatLayouts: SeatLayout[];

  @ApiProperty({ description: 'Séances dans cette salle' })
  @OneToMany(() => Session, (session) => session.hall)
  sessions: Session[];

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
