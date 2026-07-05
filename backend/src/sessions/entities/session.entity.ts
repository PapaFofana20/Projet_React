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
import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Hall } from '../../cinemas/entities/hall.entity';

export enum SessionType {
  STANDARD = 'standard',
  THREE_D = '3D',
  IMAX = 'IMAX',
  VIP = 'VIP',
  DOLBY = 'Dolby Atmos',
}

export enum ScreenType {
  REGULAR = 'regular',
  LARGE = 'large',
  SMALL = 'small',
}

@Entity('sessions')
export class Session {
  @ApiProperty({ description: 'Identifiant unique de la séance' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID du film' })
  @Column({ name: 'movie_id' })
  movieId: number;

  @ApiProperty({ description: 'Film associé' })
  @ManyToOne(() => Movie, (movie) => movie.sessions, { eager: false })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ApiProperty({ description: 'ID de la salle' })
  @Column({ name: 'hall_id', nullable: true })
  hallId: number;

  @ApiProperty({ description: 'Salle associée' })
  @ManyToOne(() => Hall, (hall) => hall.sessions, { eager: false, nullable: true })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @ApiProperty({ description: 'Nom de la salle' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  roomName: string;

  @ApiProperty({ description: 'Type décran' })
  @Column({
    type: 'enum',
    enum: ScreenType,
    default: ScreenType.REGULAR,
  })
  screenType: ScreenType;

  @ApiProperty({ enum: SessionType, description: 'Type de séance' })
  @Column({
    type: 'enum',
    enum: SessionType,
    default: SessionType.STANDARD,
  })
  sessionType: SessionType;

  @ApiProperty({ description: 'Date et heure de la séance' })
  @Column({ type: 'datetime' })
  startTime: Date;

  @ApiProperty({ description: 'Date et heure de fin estimée' })
  @Column({ type: 'datetime' })
  endTime: Date;

  @ApiProperty({ description: 'Prix du billet en FCFA' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Nombre total de places' })
  @Column({ type: 'int', default: 100, name: 'total_seats' })
  totalSeats: number;

  @ApiProperty({ description: 'Nombre de places disponibles' })
  @Column({ type: 'int', default: 100, name: 'available_seats' })
  availableSeats: number;

  @ApiProperty({ description: 'Places réservées (format JSON)' })
  @Column({ type: 'simple-json', nullable: true, name: 'reserved_seats' })
  reservedSeats: string[];

  @ApiProperty({ description: 'La séance est-elle active ?' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Réservations pour cette séance' })
  @OneToMany(() => Booking, (booking) => booking.session)
  bookings: Booking[];

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
