import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MovieGenre, MovieRating } from '../entities/movie.entity';

export class CreateMovieDto {
  @ApiProperty({ example: 'Oppenheimer' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Lhistoire du scientifique J. Robert Oppenheimer...' })
  @IsString()
  synopsis: string;

  @ApiProperty({ example: 'https://example.com/poster.jpg' })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiProperty({ example: 'https://youtube.com/watch?v=xxx', required: false })
  @IsOptional()
  @IsUrl()
  trailerUrl?: string;

  @ApiProperty({ enum: MovieGenre, isArray: true, example: ['Drame', 'Histoire'] })
  @IsArray()
  @IsEnum(MovieGenre, { each: true })
  genres: MovieGenre[];

  @ApiProperty({ example: 180 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 2023 })
  @IsNumber()
  @Min(1888)
  @Max(2030)
  releaseYear: number;

  @ApiProperty({ example: 'Christopher Nolan' })
  @IsString()
  director: string;

  @ApiProperty({ enum: MovieRating, example: MovieRating.R })
  @IsEnum(MovieRating)
  rating: MovieRating;

  @ApiProperty({ example: 'Cillian Murphy, Emily Blunt', required: false })
  @IsOptional()
  @IsString()
  cast?: string;

  @ApiProperty({ example: 'Anglais' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'Français, Anglais', required: false })
  @IsOptional()
  @IsString()
  subtitles?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isShowing?: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateMovieDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  trailerUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(MovieGenre, { each: true })
  genres?: MovieGenre[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1888)
  @Max(2030)
  releaseYear?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(MovieRating)
  rating?: MovieRating;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cast?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitles?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isShowing?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class MovieQueryDto {
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

  @ApiProperty({ required: false, enum: MovieGenre })
  @IsOptional()
  @IsEnum(MovieGenre)
  genre?: MovieGenre;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isShowing?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1888)
  @Max(2030)
  year?: number;
}
