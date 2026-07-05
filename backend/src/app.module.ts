import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { SessionsModule } from './sessions/sessions.module';
import { BookingsModule } from './bookings/bookings.module';
import { WeatherModule } from './weather/weather.module';
import { DatabaseModule } from './database/database.module';
import { ExchangeModule } from './exchange/exchange.module';
import { AdminModule } from './admin/admin.module';
import { CinemasModule } from './cinemas/cinemas.module';

@Module({
  imports: [
    // Configuration des variables denvironnement
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuration TypeORM avec MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'seneflix'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Modules de lapplication
    DatabaseModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    SessionsModule,
    BookingsModule,
    WeatherModule,
    ExchangeModule,
    CinemasModule, // Module Cinémas & Salles
    AdminModule,
  ],
})
export class AppModule {}
