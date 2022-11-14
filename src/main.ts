// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ preflightContinue: true });

  const config = new DocumentBuilder()
    .setTitle('Heartbeats service')
    .setDescription('Documentation for heartbeats service endpoints')
    .setVersion('1.0')
    .addTag('Heartbeats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.API_PORT || 8081);
}

bootstrap();
