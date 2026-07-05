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
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from './dto/movie.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer un nouveau film (Admin)' })
  @ApiResponse({ status: 201, description: 'Film créé' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtenir tous les films' })
  @ApiResponse({ status: 200, description: 'Liste des films' })
  findAll(@Query() query: MovieQueryDto) {
    return this.moviesService.findAll(query);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Obtenir les films en avant' })
  @ApiResponse({ status: 200, description: 'Films en avant' })
  findFeatured() {
    return this.moviesService.findFeatured();
  }

  @Get('now-showing')
  @Public()
  @ApiOperation({ summary: 'Obtenir les films à laffiche' })
  @ApiResponse({ status: 200, description: 'Films à laffiche' })
  findNowShowing() {
    return this.moviesService.findNowShowing();
  }

  @Get('genre/:genre')
  @Public()
  @ApiOperation({ summary: 'Obtenir les films par genre' })
  @ApiResponse({ status: 200, description: 'Films par genre' })
  findByGenre(@Param('genre') genre: string) {
    return this.moviesService.findByGenre(genre);
  }

  @Get('stats')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir les statistiques des films (Admin)' })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  getStats() {
    return this.moviesService.stats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtenir un film par ID' })
  @ApiResponse({ status: 200, description: 'Détails du film' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mettre à jour un film (Admin)' })
  @ApiResponse({ status: 200, description: 'Film mis à jour' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Post(':id/rate')
  @Public()
  @ApiOperation({ summary: 'Noter un film' })
  @ApiResponse({ status: 200, description: 'Film noté' })
  rateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body('rating') rating: number,
  ) {
    return this.moviesService.rate(id, rating);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un film (Admin)' })
  @ApiResponse({ status: 200, description: 'Film supprimé' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}
