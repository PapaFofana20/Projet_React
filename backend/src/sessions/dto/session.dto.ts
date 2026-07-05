import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionType, ScreenType } from '../entities/session.entity';

export class CreateSessionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  movieId: number;

  @ApiProperty({ example: 'Salle A' })
  @IsString()
  roomName: string;

  @ApiProperty({ enum: ScreenType })
  @IsOptional()
  @IsEnum(ScreenType)
  screenType?: ScreenType;

  @ApiProperty({ enum: SessionType })
  @IsEnum(SessionType)
  sessionType: SessionType;

  @ApiProperty({ example: '2024-01-15T14:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalSeats?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSessionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ScreenType)
  screenType?: ScreenType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SessionType)
  sessionType?: SessionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SessionQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  movieId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SessionType)
  sessionType?: SessionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ReserveSeatsDto {
  @ApiProperty({ example: ['A1', 'A2', 'A3'], description: 'Places à réserver' })
  @IsArray()
  @IsString({ each: true })
  seats: string[];
}
