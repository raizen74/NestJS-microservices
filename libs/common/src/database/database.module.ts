import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // allows to initialize the module on app startup and access its dependencies
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),  // throws an error if the env var does not exist, better than Joi
        port: configService.getOrThrow('MYSQL_PORT'),  // throws an error if the env var does not exist, better than Joi
        database: configService.getOrThrow('MYSQL_DATABASE'),  // throws an error if the env var does not exist, better than Joi
        username: configService.getOrThrow('MYSQL_USERNAME'),  // throws an error if the env var does not exist, better than Joi
        password: configService.getOrThrow('MYSQL_PASSWORD'),  // throws an error if the env var does not exist, better than Joi
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),  // automatically creates database schema when the app launches if it does not match
        autoLoadEntities: true,  // automatically loads all entities from classes metadata, which are the same as mongoose schemas
      }),
      inject: [ConfigService],
    }),
  ],
})

export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);  // register our schemas/entities
  }
}
