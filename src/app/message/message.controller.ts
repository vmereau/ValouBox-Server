import { Body, Controller, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { Request } from 'express';
import { Channel } from "../channel/channel.entity";
import { UknownChannelError, UknownUserError } from "./message.errors";
import { UserDao } from "../core/dao/user.dao";
import { ChannelDao } from "../core/dao/channel.dao";

export interface PostMessage {
  senderId: number;
  channelId: number;
  content: string;
}

@Controller('')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userDao: UserDao,
    private readonly channelDao: ChannelDao,
  ) {}

  @Post()
  public async postMessage(
    @Req() request: Request,
    @Body() body: PostMessage,
  ): Promise<Message> {
    const sender: User = await this.userDao.findOneById(body.senderId);
    if(!sender) {
      throw new UknownUserError();
    }

    const channel: Channel = await this.channelDao.findOneById(body.channelId);
    if(!channel) {
      throw new UknownChannelError();
    }

    return this.messageService.createMessage(
      body.content,
      channel,
      sender,
      request.em,
    );
  }
}
