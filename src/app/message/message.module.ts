import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageResolver } from "./graphql/message.resolver";
import { UserModule } from "../user/user.module";
import { AppModule } from "../app.module";

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageResolver],
  exports: [MessageService]
})
export class MessageModule {}
