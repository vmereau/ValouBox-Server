import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { EntityManager } from 'typeorm';
import { MessageDao } from '../core/dao/message.dao';

@Injectable()
export class MessageService {

  constructor(private readonly messageDao: MessageDao) {}

  public async createMessage(
    content: string,
    sender: User,
    em: EntityManager,
  ): Promise<Message> {
    const newMessage: Message = new Message();
    newMessage.content = content;
    newMessage.sender = sender;

    return this.messageDao.create(newMessage, em);
  }
}
