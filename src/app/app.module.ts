import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { appRoutes } from './app.routes';
import { DatabaseModule } from '../database/database.module';
import { TypeormTransactionInterceptor } from './core/typeorm-transaction.interceptor';
import { UserModule } from './user/user.module';
import { CoreModule } from "./core/core.module";

@Module({
  imports: [
    MessageModule,
    UserModule,
    CoreModule,
    RouterModule.register(appRoutes),
    DatabaseModule,
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
