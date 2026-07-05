"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTestConfig = void 0;
exports.TypeOrmTestConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'seneflix_test',
    entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    dropSchema: true,
};
//# sourceMappingURL=typeorm.test.config.js.map