import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { EntityManager } from 'typeorm';
import { MessageDao } from '../core/dao/message.dao';
import { UserDao } from "../core/dao/user.dao";
import { Channel } from "../channel/channel.entity";

@Injectable()
export class MessageService {

  constructor(
    private readonly messageDao: MessageDao
  ) {}

  public async createMessage(
    content: string,
    channel: Channel,
    sender: User,
    em?: EntityManager,
  ): Promise<Message> {
    const newMessage: Message = new Message();
    newMessage.content = content;
    newMessage.sender = sender;
    newMessage.channel = channel;

    return this.messageDao.create(newMessage, em);
  }

  public async findOneById(id: number): Promise<Message> {
    return this.messageDao.findOneById(id);
  }

  public async findAllByUserId(userId: number): Promise<Message[]> {
    return this.messageDao.findAllByUserId(userId);
  }
}
