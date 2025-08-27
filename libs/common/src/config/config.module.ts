import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({ MONGODB_URI: Joi.string().required() }),
    }),
  ], //.forRoot tells to load env vars in memory and .env file
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
