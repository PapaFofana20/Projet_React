import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Moussa', description: 'Prénom de lutilisateur' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Diallo', description: 'Nom de famille' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'moussa.diallo@email.com', description: 'Adresse e-mail' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Mot de passe (min 8 caractères)' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: '+221771234567', description: 'Numéro de téléphone', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '1995-05-15', description: 'Date de naissance', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'moussa.diallo@email.com', description: 'Adresse e-mail' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Mot de passe' })
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'moussa.diallo@email.com', description: 'Adresse e-mail' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de réinitialisation' })
  @IsString()
  resetToken: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'Nouveau mot de passe' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123!', description: 'Ancien mot de passe' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'Nouveau mot de passe' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;
}
