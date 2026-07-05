import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Cinema } from '../../cinemas/entities/cinema.entity';

/**
 * Énumération des rôles disponibles dans le système SENEFLIX
 * - SUPER_ADMIN: Accès complet à toutes les fonctionnalités
 * - ADMIN: Gestion des cinémas, films, séances et réservations
 * - AGENT: Gestion des réservations et ventes de billets
 * - USER: Utilisateur standard (client)
 */
export enum RoleName {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
}

/**
 * Énumération des permissions par rôle
 * Chaque rôle a un niveau d'accès différent
 */
export enum RoleLevel {
  SUPER_ADMIN = 100, // Accès total
  ADMIN = 50,        // Gestion complète d'un cinéma
  AGENT = 20,        // Opérations de vente
  USER = 1,          // Consultation
}

@Entity('roles')
export class Role {
  @ApiProperty({ description: 'Identifiant unique du rôle' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: RoleName, description: 'Nom du rôle' })
  @Column({
    type: 'enum',
    enum: RoleName,
    unique: true,
    default: RoleName.USER,
  })
  name: RoleName;

  @ApiProperty({ description: 'Niveau de permission du rôle' })
  @Column({
    type: 'int',
    default: RoleLevel.USER,
  })
  level: number;

  @ApiProperty({ description: 'Description du rôle' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Utilisateurs ayant ce rôle' })
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ApiProperty({ description: 'Cinémas gérés par ce rôle (pour admins)' })
  @OneToMany(() => Cinema, (cinema) => cinema.managedBy)
  managedCinemas: Cinema[];
}
