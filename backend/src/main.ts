import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS pour le frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // Validation globale des données
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('SENEFLIX API')
    .setDescription(
      'API REST pour la plateforme de réservation de billets de cinéma SENEFLIX. ' +
        'Cette API permet la gestion des utilisateurs, films, séances et réservations.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints dauthentification')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Movies', 'Gestion des films')
    .addTag('Sessions', 'Gestion des séances')
    .addTag('Bookings', 'Gestion des réservations')
    .addTag('Weather', 'API météo externe')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
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
