import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { envs } from './config/env';
import { Logger } from 'nestjs-pino';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  const logger = app.get(Logger);

  app.useLogger(logger);

  await app.listen(envs.port, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);

  const appService = app.get(AppService);

  await appService.syncDatabase();
}
bootstrap();
