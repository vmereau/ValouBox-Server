import { Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../message/message.entity';
import { MessageDao } from './dao/message.dao';
import { EntityManager, QueryRunner } from 'typeorm';
import { UserDao } from "./dao/user.dao";
import { User } from "../user/user.entity";
import { ChannelDao } from "./dao/channel.dao";
import { Channel } from "../channel/channel.entity";

// Extend globally the Request type from Express to allow custom properties on the base type
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      queryRunner: QueryRunner;
      em: EntityManager;
    }
  }
}

const daos: Provider[] = [MessageDao, UserDao, ChannelDao];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Channel])],
  providers: daos,
  exports: daos,
})
export class CoreModule {}
