import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber, IsEnum, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScreenType } from '../../cinemas/entities/hall.entity';

/**
 * DTO pour la création dun cinéma
 */
export class CreateCinemaDto {
  @ApiProperty({ description: 'Nom du cinéma', example: 'SENEFLIX Dakar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Ville', example: 'Dakar' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Adresse complète' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: 'Téléphone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'URL de limage' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Latitude GPS' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude GPS' })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

/**
 * DTO pour la mise à jour dun cinéma
 */
export class UpdateCinemaDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

/**
 * DTO pour la création dune salle
 */
export class CreateHallDto {
  @ApiProperty({ description: 'ID du cinéma parent' })
  @IsNumber()
  @IsNotEmpty()
  cinemaId: number;

  @ApiProperty({ description: 'Nom de la salle', example: 'Salle 1 - VIP' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Capacité totale' })
  @IsNumber()
  @Min(10)
  @Max(500)
  capacity: number;

  @ApiProperty({ description: 'Nombre de rangées' })
  @IsNumber()
  @Min(5)
  @Max(20)
  rowCount: number;

  @ApiProperty({ description: 'Sièges par rangée' })
  @IsNumber()
  @Min(5)
  @Max(30)
  seatsPerRow: number;

  @ApiProperty({ enum: ScreenType, description: 'Type décran' })
  @IsEnum(ScreenType)
  screenType: ScreenType;

  @ApiProperty({ description: 'Prix de base (FCFA)' })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ description: 'Prix VIP (FCFA)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  vipPrice?: number;

  @ApiPropertyOptional({ description: 'Nombre de rangées VIP (défaut: 2)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  vipRows?: number;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * DTO pour la mise à jour dune salle
 */
export class UpdateHallDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ScreenType })
  @IsEnum(ScreenType)
  @IsOptional()
  screenType?: ScreenType;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  basePrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  vipPrice?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * DTO pour la mise à jour dun siège
 */
export class UpdateSeatDto {
  @ApiProperty({ description: 'ID du siège', example: 'A12' })
  @IsString()
  @IsNotEmpty()
  seatId: string;

  @ApiProperty({ description: 'Nouveau statut', enum: ['available', 'blocked', 'maintenance'] })
  @IsString()
  @IsNotEmpty()
  status: string;
}
