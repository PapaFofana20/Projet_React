import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../users/entities/user.entity';
import { Role, RoleName } from './entities/role.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Role) private roles: Repository<Role>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ========== INSCRIPTION ==========
  async register(dto: RegisterDto) {
    // Vérifier si l'email existe déjà
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Cet e-mail est déjà utilisé');

    // Récupérer le rôle utilisateur par défaut
    const userRole = await this.roles.findOne({ where: { name: RoleName.USER } });

    // Créer l'utilisateur
    const user = this.users.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      roles: userRole ? [userRole] : [],
    });

    await this.users.save(user);

    return {
      user: this.sanitize(user),
      ...(await this.generateTokens(user)),
    };
  }

  // ========== CONNEXION ==========
  async login(dto: LoginDto) {
    const user = await this.users.findOne({
      where: { email: dto.email },
      relations: ['roles'],
    });

    // Vérifications
    if (!user) throw new UnauthorizedException('E-mail ou mot de passe incorrect');
    if (user.status === UserStatus.SUSPENDED) throw new UnauthorizedException('Compte suspendu');
    if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException('Compte inactif');

    // Vérifier le mot de passe
    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('E-mail ou mot de passe incorrect');
    }

    // Mettre à jour la dernière connexion
    await this.users.update(user.id, { lastLoginAt: new Date() });

    return {
      user: this.sanitize(user),
      ...(await this.generateTokens(user)),
    };
  }

  // ========== PROFIL ==========
  async getProfile(userId: number) {
    const user = await this.users.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');
    return this.sanitize(user);
  }

  async refreshToken(userId: number) {
    const user = await this.users.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');
    return this.generateTokens(user);
  }

  // ========== MOT DE PASSE ==========
  async changePassword(userId: number, current: string, novo: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');

    if (!(await bcrypt.compare(current, user.password))) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    user.password = await bcrypt.hash(novo, 10);
    await this.users.save(user);
    return { message: 'Mot de passe changé' };
  }

  // ========== PRIVÉ ==========
  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, roles: user.roles.map(r => r.name) };
    const secret = this.config.get<string>('JWT_SECRET');

    const [access, refresh] = await Promise.all([
      this.jwt.signAsync(payload, { secret, expiresIn: '15m' }),
      this.jwt.signAsync(payload, { secret, expiresIn: '7d' }),
    ]);

    return { accessToken: access, refreshToken: refresh, tokenType: 'Bearer' };
  }

  private sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
