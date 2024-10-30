import { Routes } from '@nestjs/core';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

export const appRoutes: Routes = [
  {
    path: 'message',
    module: MessageModule,
  },

  {
    path: 'user',
    module: UserModule,
  },
];
