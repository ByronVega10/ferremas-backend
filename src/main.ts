import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ 
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('FERREMAS API')
    .setDescription(
      `
    API REST oficial de FERREMAS.

    Esta API permite:

    - Gestión de productos
    - Gestión de categorías
    - Autenticación JWT
    - Carrito de compras
    - Órdenes de compra
    - Integración con Mercado Pago
    - Gestión de usuarios

    Autenticación:
    La mayoría de endpoints protegidos requieren Bearer Token JWT.
    `,
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'FERREMAS API Docs',
  });

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
}

bootstrap();
