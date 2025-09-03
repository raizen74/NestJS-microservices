import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('PORT_TCP'),
    }
  })
  app.useLogger(app.get(Logger)); // make payments app use the pino-logger
  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow('PORT_HTTP'))  // listen on a port for so graphql gateway can reach it
}
bootstrap();
