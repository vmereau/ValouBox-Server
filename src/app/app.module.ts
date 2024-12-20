import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { appRoutes } from './app.routes';
import { DatabaseModule } from '../database/database.module';
import { TypeormTransactionInterceptor } from './core/typeorm-transaction.interceptor';
import { UserModule } from './user/user.module';
import { CoreModule } from "./core/core.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config/dist";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from 'path';
import { upperDirectiveTransformer } from "./core/graphql/directives/upper-case.directive";
import { GlobalModule } from "./global.module";
import { ChannelModule } from "./channel/channel.module";
import { ChannelService } from "./channel/channel.service";
import { Request } from "express";

@Module({
  imports: [
    MessageModule,
    UserModule,
    CoreModule,
    RouterModule.register(appRoutes),
    DatabaseModule,
    AuthModule,
    ChannelModule,
    GlobalModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ChannelModule],
      inject:[ChannelService],
      useFactory: async (channelService: ChannelService) => ({
        installSubscriptionHandlers: true,
        typePaths: ['./**/graphql/*.graphql'],
        transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'class',
        },
        subscriptions: {
          'graphql-ws': {
            onDisconnect: (ctx) => {
              const extraCTX = ctx.extra as any;
              const request: Request = extraCTX.request;

              if(extraCTX.request){
                channelService.removeUserFromChannel(request.user, request.channelId);
              }
            }
          }
        },
        sortSchema: true,
        playground: true
      })
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TypeormTransactionInterceptor,
    },
  ]
})
export class AppModule {}
