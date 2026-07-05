"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SENEFLIX API')
        .setDescription('API REST pour la plateforme de réservation de billets de cinéma SENEFLIX. ' +
        'Cette API permet la gestion des utilisateurs, films, séances et réservations.')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT',
    }, 'JWT-auth')
        .addTag('Auth', 'Endpoints dauthentification')
        .addTag('Users', 'Gestion des utilisateurs')
        .addTag('Movies', 'Gestion des films')
        .addTag('Sessions', 'Gestion des séances')
        .addTag('Bookings', 'Gestion des réservations')
        .addTag('Weather', 'API météo externe')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🎬  SENEFLIX Backend API - Opérationnel                  ║
║                                                               ║
║     📍 http://localhost:${port}                               ║
║     📖 Documentation: http://localhost:${port}/api/docs        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map