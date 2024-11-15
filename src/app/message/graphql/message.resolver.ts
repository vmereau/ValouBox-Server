import { Args, Resolver, Query, Mutation, Subscription } from "@nestjs/graphql";
import { MessageService } from "../message.service";
import { Message } from "../message.entity";
import { UserDao } from "../../core/dao/user.dao";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { ChannelDao } from "../../core/dao/channel.dao";
import { Channel } from "../../channel/channel.entity";
import { User } from "../../user/user.entity";
import { UknownChannelError, UknownUserError } from "../message.errors";

@Resolver('Message')
export class MessageResolver {
  constructor(
    private messageService: MessageService,
    private readonly userDao: UserDao,
    private readonly channelDao: ChannelDao,
    @Inject('PUB_SUB') private pubSub: PubSub
  ) {}

  @Query('message')
  async message(@Args('id') id: number): Promise<Message> {
    return this.messageService.findOneById(id);
  }

  @Mutation('postMessage')
  async postMessage(@Args('content') content: string, @Args('senderId') senderId: number, @Args('channelId') channelId: number): Promise<Message> {
    const sender: User = await this.userDao.findOneById(senderId);
    if(!sender) {
      throw new UknownUserError();
    }

    const channel: Channel = await this.channelDao.findOneById(channelId);
    if(!channel) {
      throw new UknownChannelError();
    }

    const newMessage: Message = await this.messageService.createMessage(content, channel, sender);

    await this.pubSub.publish('messageAdded', { newMessage, channel });

    return newMessage;
  }

  @Subscription('messageAdded', {
    filter: (payload, variables) => {
      return payload.channel === variables.channel
    },
    resolve: value =>  value.newMessage,
  })
  messageAdded(@Args('channel') channel: string) {
    return this.pubSub.asyncIterableIterator('messageAdded');
  }
}

