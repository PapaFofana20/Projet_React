import { Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';
export declare class CinemasService {
    private readonly cinemaRepository;
    constructor(cinemaRepository: Repository<Cinema>);
    findAll(): Promise<Cinema[]>;
    findOne(id: number): Promise<Cinema>;
    findByCity(city: string): Promise<Cinema[]>;
    create(data: Partial<Cinema>): Promise<Cinema>;
    update(id: number, data: Partial<Cinema>): Promise<Cinema>;
    remove(id: number): Promise<void>;
}
