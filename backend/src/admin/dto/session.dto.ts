import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber, IsEnum, Min, Max, IsArray, ValidateNested, IsDateString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionType } from '../../sessions/entities/session.entity';

/**
 * DTO pour la création dune séance
 * Inclut le calcul automatique de lheure de fin
 */
export class CreateSessionDto {
  @ApiProperty({ description: 'ID du film' })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({ description: 'ID de la salle' })
  @IsNumber()
  @IsNotEmpty()
  hallId: number;

  @ApiProperty({ description: 'Date et heure de début (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiPropertyOptional({ description: 'Type de séance (optionnel, hérite du film)' })
  @IsEnum(SessionType)
  @IsOptional()
  sessionType?: SessionType;

  @ApiPropertyOptional({ description: 'Prix personnalisé (optionnel, hérite de la salle)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Définir manuellement lheure de fin (optionnel)' })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Rendre la séance inactive immédiatement' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

/**
 * DTO pour la mise à jour dune séance
 */
export class UpdateSessionDto {
  @ApiPropertyOptional({ description: 'ID du film' })
  @IsNumber()
  @IsOptional()
  movieId?: number;

  @ApiPropertyOptional({ description: 'ID de la salle' })
  @IsNumber()
  @IsOptional()
  hallId?: number;

  @ApiPropertyOptional({ description: 'Nouvelle date/heure de début' })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ description: 'Nouvelle date/heure de fin' })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ enum: SessionType })
  @IsEnum(SessionType)
  @IsOptional()
  sessionType?: SessionType;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

/**
 * DTO pour la création dun film
 */
export class CreateMovieDto {
  @ApiProperty({ description: 'Titre du film' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Synopsis' })
  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @ApiPropertyOptional({ description: 'URL de limage' })
  @IsString()
  @IsOptional()
  posterUrl?: string;

  @ApiPropertyOptional({ description: 'URL de la bande-annonce' })
  @IsString()
  @IsOptional()
  trailerUrl?: string;

  @ApiProperty({ description: 'Genres (tableau)' })
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({ description: 'Durée en minutes' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Année de sortie' })
  @IsNumber()
  @Min(1900)
  @Max(2030)
  releaseYear: number;

  @ApiProperty({ description: 'Réalisateur' })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiPropertyOptional({ description: 'Classification' })
  @IsString()
  @IsOptional()
  rating?: string;

  @ApiPropertyOptional({ description: 'Acteurs' })
  @IsString()
  @IsOptional()
  cast?: string;

  @ApiPropertyOptional({ description: 'Langue' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ description: 'Sous-titres' })
  @IsString()
  @IsOptional()
  subtitles?: string;

  @ApiPropertyOptional({ description: 'Film à laffiche' })
  @IsBoolean()
  @IsOptional()
  isShowing?: boolean;

  @ApiPropertyOptional({ description: 'Film en avant' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

/**
 * DTO pour la mise à jour dun film
 */
export class UpdateMovieDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  synopsis?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genres?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isShowing?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

/**
 * DTO pour la création dun utilisateur (admin)
 */
export class CreateUserDto {
  @ApiProperty({ description: 'Prénom' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Nom' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mot de passe (sera haché)' })
  @IsString()
  @Min(8)
  password: string;

  @ApiPropertyOptional({ description: 'Téléphone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Date de naissance' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
}

/**
 * DTO pour la mise à jour du statut dun utilisateur
 */
export class UpdateUserStatusDto {
  @ApiProperty({ description: 'Nouveau statut', enum: ['active', 'inactive', 'suspended'] })
  @IsString()
  @IsNotEmpty()
  status: string;
}

/**
 * DTO pour assigner un rôle à un utilisateur
 */
export class AssignRoleDto {
  @ApiProperty({ description: 'Nom du rôle à assigner' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiPropertyOptional({ description: 'ID du cinéma à gérer (pour ADMIN)' })
  @IsNumber()
  @IsOptional()
  cinemaId?: number;
}
