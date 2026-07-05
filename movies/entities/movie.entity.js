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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = exports.MovieRating = exports.MovieGenre = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const session_entity_1 = require("../../sessions/entities/session.entity");
var MovieGenre;
(function (MovieGenre) {
    MovieGenre["ACTION"] = "Action";
    MovieGenre["COMEDY"] = "Com\u00E9die";
    MovieGenre["DRAMA"] = "Drame";
    MovieGenre["HORROR"] = "Horreur";
    MovieGenre["ROMANCE"] = "Romance";
    MovieGenre["THRILLER"] = "Thriller";
    MovieGenre["SCI_FI"] = "Science-Fiction";
    MovieGenre["ANIMATION"] = "Animation";
    MovieGenre["DOCUMENTARY"] = "Documentaire";
    MovieGenre["ADVENTURE"] = "Aventure";
    MovieGenre["FANTASY"] = "Fantaisie";
    MovieGenre["WAR"] = "Guerre";
    MovieGenre["MUSICAL"] = "Musical";
    MovieGenre["MYSTERY"] = "Myst\u00E8re";
    MovieGenre["WESTERN"] = "Western";
})(MovieGenre || (exports.MovieGenre = MovieGenre = {}));
var MovieRating;
(function (MovieRating) {
    MovieRating["G"] = "G";
    MovieRating["PG"] = "PG";
    MovieRating["PG_13"] = "PG-13";
    MovieRating["R"] = "R";
    MovieRating["NC_17"] = "NC-17";
})(MovieRating || (exports.MovieRating = MovieRating = {}));
let Movie = class Movie {
};
exports.Movie = Movie;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique du film' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Titre du film' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Synopsis du film' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Movie.prototype, "synopsis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL de limage du film' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'poster_url' }),
    __metadata("design:type", String)
], Movie.prototype, "posterUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL de la bande-annonce', required: false }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'trailer_url' }),
    __metadata("design:type", String)
], Movie.prototype, "trailerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: MovieGenre,
        isArray: true,
        description: 'Genres du film',
    }),
    (0, typeorm_1.Column)({ type: 'simple-json' }),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Durée du film en minutes' }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Movie.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Année de sortie' }),
    (0, typeorm_1.Column)({ type: 'int', name: 'release_year' }),
    __metadata("design:type", Number)
], Movie.prototype, "releaseYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Réalisateur du film' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Movie.prototype, "director", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: MovieRating,
        description: 'Classification du film',
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MovieRating,
        default: MovieRating.PG_13,
    }),
    __metadata("design:type", String)
], Movie.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Acteurs principaux', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "cast", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Langue originale du film' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'Français' }),
    __metadata("design:type", String)
], Movie.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sous-titres disponibles', required: false }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "subtitles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Note moyenne du film' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Movie.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de votes' }),
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'vote_count' }),
    __metadata("design:type", Number)
], Movie.prototype, "voteCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Le film est-il à laffiche ?' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Movie.prototype, "isShowing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Le film est-il en avant ?' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_featured' }),
    __metadata("design:type", Boolean)
], Movie.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Séances associées au film' }),
    (0, typeorm_1.OneToMany)(() => session_entity_1.Session, (session) => session.movie),
    __metadata("design:type", Array)
], Movie.prototype, "sessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Movie.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Movie.prototype, "updatedAt", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)('movies')
], Movie);
//# sourceMappingURL=movie.entity.js.map