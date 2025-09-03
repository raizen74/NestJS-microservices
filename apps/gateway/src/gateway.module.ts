import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { AUTH_SERVICE, LoggerModule } from '@app/common';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { authContext } from './auth.context';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        server: {
          // called everytime a graphQL request is sent to GRAPHQL gateway
          context: authContext, // returns the user
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'reservations',
                url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL'),
              },
            ],
          }),
          buildService({ url }) {
            return new RemoteGraphQLDataSource({
              url,
              // function called everytime we send a request to a remote GraphQL data source or downstream GraphQL service
              willSendRequest({ request, context }) {
                request.http?.headers.set(
                  'user',
                  context.user ? JSON.stringify(context.user) : '',
                );  // attach the user returned by the auth context to the header
              },
            });
          },
        },
      }),
      inject: [ConfigService],
    }),
    // Communication with AUTH microservice
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('AUTH_HOST'),
            port: configService.getOrThrow('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
  ],
})
export class GatewayModule {}
