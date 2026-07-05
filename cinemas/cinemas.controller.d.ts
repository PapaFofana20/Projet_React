import { CinemasService } from './cinemas.service';
export declare class CinemasController {
    private readonly cinemasService;
    constructor(cinemasService: CinemasService);
    findAll(): Promise<import("./entities/cinema.entity").Cinema[]>;
    findOne(id: number): Promise<import("./entities/cinema.entity").Cinema>;
    create(data: any): Promise<import("./entities/cinema.entity").Cinema>;
    update(id: number, data: any): Promise<import("./entities/cinema.entity").Cinema>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
