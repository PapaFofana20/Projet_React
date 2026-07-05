import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Hall } from './hall.entity';
import { Role } from '../../auth/entities/role.entity';

/**
 * Entité Cinéma - Représente un cinéma dans le réseau SENEFLIX
 * Un cinéma peut avoir plusieurs salles (Halls)
 */
@Entity('cinemas')
export class Cinema {
  @ApiProperty({ description: 'Identifiant unique du cinéma' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nom du cinéma' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Ville où se trouve le cinéma' })
  @Column({ type: 'varchar', length: 100 })
  city: string;

  @ApiProperty({ description: 'Adresse complète du cinéma' })
  @Column({ type: 'varchar', length: 500 })
  address: string;

  @ApiProperty({ description: 'Numéro de téléphone du cinéma' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Email de contact' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ApiProperty({ description: 'URL de limage du cinéma' })
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'image_url' })
  imageUrl: string;

  @ApiProperty({ description: 'Coordonnées GPS - Latitude' })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Coordonnées GPS - Longitude' })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @ApiProperty({ description: 'Horaires douverture (format JSON)' })
  @Column({ type: 'simple-json', nullable: true })
  openingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[];

  @ApiProperty({ description: 'Le cinéma est-il actif ?' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'ID de ladmin gestionnaire (nullable)' })
  @Column({ name: 'managed_by', nullable: true })
  managedById: number;

  @ApiProperty({ description: 'Admin gestionnaire du cinéma' })
  @ManyToOne(() => Role, (role) => role.managedCinemas, { nullable: true })
  @JoinColumn({ name: 'managed_by' })
  managedBy: Role;

  @ApiProperty({ description: 'Salles du cinéma' })
  @OneToMany(() => Hall, (hall) => hall.cinema)
  halls: Hall[];

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
