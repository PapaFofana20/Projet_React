import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'Moussa', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ example: 'Diallo', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({ example: '+221771234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: '1995-05-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus, description: 'Nouveau statut' })
  @IsEnum(UserStatus)
  status: UserStatus;
}
