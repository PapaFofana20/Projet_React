import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CinemasService } from './cinemas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';

@ApiTags('Admin - Cinémas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Liste des cinémas' })
  async findAll() {
    return this.cinemasService.findAll();
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Détails dun cinéma' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cinemasService.findOne(id);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau cinéma' })
  async create(@Body() data: any) {
    return this.cinemasService.create(data);
  }

  @Put(':id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un cinéma' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.cinemasService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un cinéma' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.cinemasService.remove(id);
    return { message: 'Cinéma supprimé avec succès' };
  }
}
