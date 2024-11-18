import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    UserModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    {
      ...JwtModule.registerAsync({
        inject: [ConfigService],
        global: true,
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
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
