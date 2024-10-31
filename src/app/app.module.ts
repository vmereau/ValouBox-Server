import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { appRoutes } from './app.routes';
import { DatabaseModule } from '../database/database.module';
import { TypeormTransactionInterceptor } from './core/typeorm-transaction.interceptor';
import { UserModule } from './user/user.module';
import { CoreModule } from "./core/core.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config/dist";

@Module({
  imports: [
    MessageModule,
    UserModule,
    CoreModule,
    RouterModule.register(appRoutes),
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    {
      ...JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          return {
            secret: config.get<string>('JWT_SECRET'),
          };
        },
        imports: [],
      }),
      global: true,
    },
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TypeormTransactionInterceptor,
    },
  ],
})
export class AppModule {}
