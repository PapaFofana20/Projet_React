"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("./entities/movie.entity");
let MoviesService = class MoviesService {
    constructor(movies) {
        this.movies = movies;
    }
    create(dto) {
        const movie = this.movies.create({
            ...dto,
            averageRating: 0,
            voteCount: 0,
        });
        return this.movies.save(movie);
    }
    findAll(query) {
        const { page = 1, limit = 12, genre, search, isShowing, isFeatured, year } = query;
        const qb = this.movies.createQueryBuilder('m');
        if (genre)
            qb.andWhere('JSON_CONTAINS(m.genres, :g)', { g: JSON.stringify(genre) });
        if (search)
            qb.andWhere('(m.title LIKE :s OR m.director LIKE :s OR m.synopsis LIKE :s)', { s: `%${search}%` });
        if (isShowing !== undefined)
            qb.andWhere('m.isShowing = :v', { v: isShowing });
        if (isFeatured !== undefined)
            qb.andWhere('m.isFeatured = :v', { v: isFeatured });
        if (year)
            qb.andWhere('m.releaseYear = :y', { y: year });
        return qb.orderBy('m.isFeatured', 'DESC').addOrderBy('m.createdAt', 'DESC')
            .skip((page - 1) * limit).take(limit)
            .getManyAndCount().then(([data, total]) => ({
            data, total, page, limit, pages: Math.ceil(total / limit)
        }));
    }
    async findOne(id) {
        const movie = await this.movies.findOne({ where: { id }, relations: ['sessions'] });
        if (!movie)
            throw new common_1.NotFoundException(`Film ${id} non trouvé`);
        return movie;
    }
    findFeatured() {
        return this.movies.find({ where: { isFeatured: true, isShowing: true }, order: { createdAt: 'DESC' }, take: 10 });
    }
    findNowShowing() {
        return this.movies.find({ where: { isShowing: true }, order: { releaseYear: 'DESC' }, take: 20 });
    }
    findByGenre(genre, limit = 10) {
        return this.movies.createQueryBuilder('m')
            .where('JSON_CONTAINS(m.genres, :g)', { g: JSON.stringify(genre) })
            .andWhere('m.isShowing = true')
            .orderBy('m.averageRating', 'DESC').take(limit).getMany();
    }
    async update(id, dto) {
        const movie = await this.movies.findOne({ where: { id } });
        if (!movie)
            throw new common_1.NotFoundException(`Film ${id} non trouvé`);
        await this.movies.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const movie = await this.movies.findOne({ where: { id } });
        if (!movie)
            throw new common_1.NotFoundException(`Film ${id} non trouvé`);
        await this.movies.remove(movie);
        return { message: 'Film supprimé' };
    }
    async rate(id, rating) {
        const movie = await this.findOne(id);
        const newCount = movie.voteCount + 1;
        const newAvg = (movie.averageRating * movie.voteCount + rating) / newCount;
        await this.movies.update(id, { voteCount: newCount, averageRating: Number(newAvg.toFixed(1)) });
        return this.findOne(id);
    }
    stats() {
        return Promise.all([
            this.movies.count(),
            this.movies.count({ where: { isShowing: true } }),
            this.movies.count({ where: { isFeatured: true } }),
        ]).then(([total, nowShowing, featured]) => ({ total, nowShowing, featured }));
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MoviesService);
//# sourceMappingURL=movies.service.js.map