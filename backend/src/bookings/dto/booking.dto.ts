import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsEmail,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus, PaymentMethod } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'ID de la séance' })
  @IsNumber()
  sessionId: number;

  @ApiProperty({ example: ['A1', 'A2'], description: 'Places à réserver' })
  @IsArray()
  @IsString({ each: true })
  seats: string[];

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ORANGE_MONEY })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '+221771234567', description: 'Téléphone pour le paiement' })
  @IsString()
  @MaxLength(20)
  paymentPhone: string;

  @ApiProperty({ example: 'Moussa Diallo', required: false })
  @IsOptional()
  @IsString()
  viewerName?: string;

  @ApiProperty({ example: 'moussa@email.com', required: false })
  @IsOptional()
  @IsEmail()
  viewerEmail?: string;
}

export class UpdateBookingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class BookingQueryDto {
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
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bookingCode?: string;
}

export class CancelBookingDto {
  @ApiProperty({ example: 'Motif de lannulation', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
