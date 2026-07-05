import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from '../../auth/entities/role.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Identifiant unique de lutilisateur' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Prénom de lutilisateur' })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Nom de famille de lutilisateur' })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Adresse e-mail unique' })
  @Column({ type: 'varchar', length: 190, unique: true })
  email: string;

  @ApiProperty({ description: 'Mot de passe (haché)' })
  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'Numéro de téléphone', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ enum: UserStatus, description: 'Statut du compte' })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({ description: 'Photo de profil URL', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'avatar_url' })
  avatarUrl: string;

  @ApiProperty({ description: 'Date de naissance', required: false })
  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date | null;

  @ApiProperty({ description: 'Les rôles de lutilisateur' })
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ApiProperty({ description: 'Réservations de lutilisateur' })
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @ApiProperty({ description: 'Date de création du compte' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Date de dernière connexion', required: false })
  @Column({ type: 'datetime', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;
}
