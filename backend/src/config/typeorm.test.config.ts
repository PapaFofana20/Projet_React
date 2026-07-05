import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmTestConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'seneflix_test',
  entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
  synchronize: true, // Only for tests - creates schema automatically
  logging: false,
  dropSchema: true, // Clean database before each test
};
