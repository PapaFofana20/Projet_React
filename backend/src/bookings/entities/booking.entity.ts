import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Session } from '../../sessions/entities/session.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentMethod {
  CASH = 'cash',
  ORANGE_MONEY = 'orange_money',
  WAV_MONEY = 'wav_money',
  CARD = 'card',
}

@Entity('bookings')
export class Booking {
  @ApiProperty({ description: 'Identifiant unique de la réservation' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Code unique de la réservation' })
  @Column({ type: 'varchar', length: 20, unique: true })
  bookingCode: string;

  @ApiProperty({ description: 'ID de lutilisateur' })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({ description: 'Utilisateur associé' })
  @ManyToOne(() => User, (user) => user.bookings, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'ID de la séance' })
  @Column({ name: 'session_id' })
  sessionId: number;

  @ApiProperty({ description: 'Séance associée' })
  @ManyToOne(() => Session, (session) => session.bookings, { eager: false })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ApiProperty({
    enum: BookingStatus,
    description: 'Statut de la réservation',
  })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({ description: 'Places réservées' })
  @Column({ type: 'simple-json' })
  seats: string[];

  @ApiProperty({ description: 'Nombre de billets' })
  @Column({ type: 'int', default: 1 })
  ticketCount: number;

  @ApiProperty({ description: 'Prix total en FCFA' })
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;

  @ApiProperty({
    enum: PaymentMethod,
    description: 'Méthode de paiement',
  })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Transaction ID (pour paiements numériques)' })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'transaction_id',
  })
  transactionId: string;

  @ApiProperty({ description: 'Numéro de téléphone pour le paiement' })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'payment_phone',
  })
  paymentPhone: string;

  @ApiProperty({ description: 'Code QR pour le billet', required: false })
  @Column({ type: 'text', nullable: true, name: 'qr_code' })
  qrCode: string;

  @ApiProperty({ description: 'Nom du spectateur' })
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'viewer_name' })
  viewerName: string;

  @ApiProperty({ description: 'Email du spectateur' })
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'viewer_email' })
  viewerEmail: string;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Date dannulation', required: false })
  @Column({ type: 'datetime', nullable: true, name: 'cancelled_at' })
  cancelledAt: Date;
}
