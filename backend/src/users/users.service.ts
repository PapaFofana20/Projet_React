import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  // ========== LISTE ==========
  findAll(page = 1, limit = 10) {
    return this.users.findAndCount({
      relations: ['roles'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    }).then(([users, total]) => ({
      data: users.map(u => this.sanitize(u)),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }));
  }

  // ========== UN SEUL ==========
  findOne(id: number) {
    return this.users.findOne({
      where: { id },
      relations: ['roles', 'bookings'],
    }).then(user => {
      if (!user) throw new NotFoundException(`Utilisateur ${id} non trouvé`);
      return this.sanitize(user);
    });
  }

  findByEmail(email: string) {
    return this.users.findOne({ where: { email }, relations: ['roles'] })
      .then(user => user ? this.sanitize(user) : null);
  }

  // ========== MODIFIER ==========
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Utilisateur ${id} non trouvé`);

    if (dto.dateOfBirth) dto.dateOfBirth = new Date(dto.dateOfBirth) as any;
    await this.users.update(id, dto);
    return this.findOne(id);
  }

  async updateStatus(id: number, dto: UpdateUserStatusDto) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Utilisateur ${id} non trouvé`);

    await this.users.update(id, { status: dto.status });
    return this.findOne(id);
  }

  // ========== SUPPRIMER ==========
  async remove(id: number) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    await this.users.remove(user);
    return { message: 'Utilisateur supprimé' };
  }

  // ========== STATS ==========
  async stats(id: number) {
    const user = await this.users.findOne({
      where: { id },
      relations: ['bookings'],
    });
    if (!user) throw new NotFoundException(`Utilisateur ${id} non trouvé`);

    const bookings = user.bookings || [];
    return {
      userId: id,
      totalBookings: bookings.length,
      totalSpent: bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0),
      accountCreated: user.createdAt,
      lastLogin: user.lastLoginAt,
    };
  }

  // ========== PRIVÉ ==========
  private sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
