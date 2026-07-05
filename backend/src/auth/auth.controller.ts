import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from './entities/role.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Inscription dun nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur inscrit avec succès',
  })
  @ApiResponse({
    status: 409,
    description: 'Cet e-mail est déjà utilisé',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion dun utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants incorrects',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Rafraîchir le token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Nouveau token généré',
  })
  async refreshToken(@CurrentUser() user: User) {
    return this.authService.refreshToken(user.id);
  }

  @Post('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir le profil de lutilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur',
  })
  async getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Changer le mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe changé avec succès',
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
