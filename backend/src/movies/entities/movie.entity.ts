import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../../sessions/entities/session.entity';

export enum MovieGenre {
  ACTION = 'Action',
  COMEDY = 'Comédie',
  DRAMA = 'Drame',
  HORROR = 'Horreur',
  ROMANCE = 'Romance',
  THRILLER = 'Thriller',
  SCI_FI = 'Science-Fiction',
  ANIMATION = 'Animation',
  DOCUMENTARY = 'Documentaire',
  ADVENTURE = 'Aventure',
  FANTASY = 'Fantaisie',
  WAR = 'Guerre',
  MUSICAL = 'Musical',
  MYSTERY = 'Mystère',
  WESTERN = 'Western',
}

export enum MovieRating {
  G = 'G',
  PG = 'PG',
  PG_13 = 'PG-13',
  R = 'R',
  NC_17 = 'NC-17',
}

@Entity('movies')
export class Movie {
  @ApiProperty({ description: 'Identifiant unique du film' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Titre du film' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'Synopsis du film' })
  @Column({ type: 'text' })
  synopsis: string;

  @ApiProperty({ description: 'URL de limage du film' })
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'poster_url' })
  posterUrl: string;

  @ApiProperty({ description: 'URL de la bande-annonce', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'trailer_url' })
  trailerUrl: string;

  @ApiProperty({
    enum: MovieGenre,
    isArray: true,
    description: 'Genres du film',
  })
  @Column({ type: 'simple-json' })
  genres: MovieGenre[];

  @ApiProperty({ description: 'Durée du film en minutes' })
  @Column({ type: 'int' })
  duration: number;

  @ApiProperty({ description: 'Année de sortie' })
  @Column({ type: 'int', name: 'release_year' })
  releaseYear: number;

  @ApiProperty({ description: 'Réalisateur du film' })
  @Column({ type: 'varchar', length: 255 })
  director: string;

  @ApiProperty({
    enum: MovieRating,
    description: 'Classification du film',
  })
  @Column({
    type: 'enum',
    enum: MovieRating,
    default: MovieRating.PG_13,
  })
  rating: MovieRating;

  @ApiProperty({ description: 'Acteurs principaux', required: false })
  @Column({ type: 'text', nullable: true })
  cast: string;

  @ApiProperty({ description: 'Langue originale du film' })
  @Column({ type: 'varchar', length: 100, default: 'Français' })
  language: string;

  @ApiProperty({ description: 'Sous-titres disponibles', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  subtitles: string;

  @ApiProperty({ description: 'Note moyenne du film' })
  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  averageRating: number;

  @ApiProperty({ description: 'Nombre de votes' })
  @Column({ type: 'int', default: 0, name: 'vote_count' })
  voteCount: number;

  @ApiProperty({ description: 'Le film est-il à laffiche ?' })
  @Column({ type: 'boolean', default: true })
  isShowing: boolean;

  @ApiProperty({ description: 'Le film est-il en avant ?' })
  @Column({ type: 'boolean', default: false, name: 'is_featured' })
  isFeatured: boolean;

  @ApiProperty({ description: 'Séances associées au film' })
  @OneToMany(() => Session, (session) => session.movie)
  sessions: Session[];

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
