import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersResolver } from "./graphql/users.resolver";
import { MessageModule } from "../message/message.module";

@Module({
  controllers: [UserController],
  providers: [UserService, UsersResolver],
  exports: [UserService],
  imports: [MessageModule]
})
export class UserModule {}
