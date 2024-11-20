import { Routes } from '@nestjs/core';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from "./channel/channel.module";

export const appRoutes: Routes = [
  {
    path: 'message',
    module: MessageModule,
  },

  {
    path: 'user',
    module: UserModule,
  },
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'channel',
    module: ChannelModule
  }
];
