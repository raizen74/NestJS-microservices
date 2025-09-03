import { IntrospectAndCompose } from "@apollo/gateway";
import { LoggerModule } from "@app/common";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'reservations',
                url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL')
              }
            ]
          })
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    LoggerModule
  ]
})
export class GatewayModule {}