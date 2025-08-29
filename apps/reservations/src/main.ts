import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import {Logger} from 'nestjs-pino'
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());  // middleware is similar to guards, but they are executed before the request reaches the route handler
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));  // Add class validator decorators to DTOs, whitelist prevents to persist extra properties not decorated in the DTOs
  app.useLogger(app.get(Logger))
  const configService = app.get(ConfigService); // app.get allow us to retrieve any injectable
  await app.listen(configService.get('PORT')!);

}
bootstrap();
