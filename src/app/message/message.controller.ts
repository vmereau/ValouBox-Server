import { Body, Controller, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { Request } from 'express';

export interface PostMessage {
  sender: User;
  content: string;
}

@Controller('')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  public async postMessage(
    @Req() request: Request,
    @Body() body: PostMessage,
  ): Promise<Message> {
    return this.messageService.createMessage(
      body.content,
      body.sender,
      request.em,
    );
  }
}
