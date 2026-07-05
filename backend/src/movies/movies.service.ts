import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectRepository(Movie) private movies: Repository<Movie>) {}

  // ========== CRÉER ==========
  create(dto: CreateMovieDto) {
    const movie = this.movies.create({
      ...dto,
      averageRating: 0,
      voteCount: 0,
    });
    return this.movies.save(movie);
  }

  // ========== LISTE ==========
  findAll(query: MovieQueryDto) {
    const { page = 1, limit = 12, genre, search, isShowing, isFeatured, year } = query;
    const qb = this.movies.createQueryBuilder('m');

    if (genre) qb.andWhere('JSON_CONTAINS(m.genres, :g)', { g: JSON.stringify(genre) });
    if (search) qb.andWhere('(m.title LIKE :s OR m.director LIKE :s OR m.synopsis LIKE :s)', { s: `%${search}%` });
    if (isShowing !== undefined) qb.andWhere('m.isShowing = :v', { v: isShowing });
    if (isFeatured !== undefined) qb.andWhere('m.isFeatured = :v', { v: isFeatured });
    if (year) qb.andWhere('m.releaseYear = :y', { y: year });

    return qb.orderBy('m.isFeatured', 'DESC').addOrderBy('m.createdAt', 'DESC')
      .skip((page - 1) * limit).take(limit)
      .getManyAndCount().then(([data, total]) => ({
        data, total, page, limit, pages: Math.ceil(total / limit)
      }));
  }

  // ========== UN SEUL ==========
  async findOne(id: number) {
    const movie = await this.movies.findOne({ where: { id }, relations: ['sessions'] });
    if (!movie) throw new NotFoundException(`Film ${id} non trouvé`);
    return movie;
  }

  // ========== SPÉCIAUX ==========
  findFeatured() {
    return this.movies.find({ where: { isFeatured: true, isShowing: true }, order: { createdAt: 'DESC' }, take: 10 });
  }

  findNowShowing() {
    return this.movies.find({ where: { isShowing: true }, order: { releaseYear: 'DESC' }, take: 20 });
  }

  findByGenre(genre: string, limit = 10) {
    return this.movies.createQueryBuilder('m')
      .where('JSON_CONTAINS(m.genres, :g)', { g: JSON.stringify(genre) })
      .andWhere('m.isShowing = true')
      .orderBy('m.averageRating', 'DESC').take(limit).getMany();
  }

  // ========== MODIFIER ==========
  async update(id: number, dto: UpdateMovieDto) {
    const movie = await this.movies.findOne({ where: { id } });
    if (!movie) throw new NotFoundException(`Film ${id} non trouvé`);
    await this.movies.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const movie = await this.movies.findOne({ where: { id } });
    if (!movie) throw new NotFoundException(`Film ${id} non trouvé`);
    await this.movies.remove(movie);
    return { message: 'Film supprimé' };
  }

  // ========== NOTER ==========
  async rate(id: number, rating: number) {
    const movie = await this.findOne(id);
    const newCount = movie.voteCount + 1;
    const newAvg = (movie.averageRating * movie.voteCount + rating) / newCount;
    await this.movies.update(id, { voteCount: newCount, averageRating: Number(newAvg.toFixed(1)) });
    return this.findOne(id);
  }

  // ========== STATS ==========
  stats() {
    return Promise.all([
      this.movies.count(),
      this.movies.count({ where: { isShowing: true } }),
      this.movies.count({ where: { isFeatured: true } }),
    ]).then(([total, nowShowing, featured]) => ({ total, nowShowing, featured }));
  }
}
