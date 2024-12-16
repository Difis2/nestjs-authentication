import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as fs from 'fs';
import fastify from 'fastify'; // Import the Fastify library

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('C:/Users/Diogo/Desktop/Projects/PROJECTS_IMPORTANTS/diana-luis-app/server.key'),
    cert: fs.readFileSync('C:/Users/Diogo/Desktop/Projects/PROJECTS_IMPORTANTS/diana-luis-app/server.cert'),
  };
  const fastifyInstance = fastify({ https: httpsOptions });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyInstance));
  app.use(helmet());
  app.enableCors();
  // Rate limiting
  app.use(
    rateLimit.rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
    })
  );
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(443, '0.0.0.0'); // HTTPS typically runs on port 443
}
bootstrap();
