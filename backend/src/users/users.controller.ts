import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Obtenir tous les utilisateurs (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findAll(page || 1, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
  @ApiResponse({
    status: 200,
    description: 'Détails de lutilisateur',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/status')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour le statut dun utilisateur (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Statut mis à jour',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un utilisateur (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obtenir les statistiques dun utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques de lutilisateur',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.stats(id);
  }
}
