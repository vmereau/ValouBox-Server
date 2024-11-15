import { Args, Resolver, Query, Mutation, Subscription } from "@nestjs/graphql";
import { MessageService } from "../message.service";
import { Message } from "../message.entity";
import { UserDao } from "../../core/dao/user.dao";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";

@Resolver('Message')
export class MessageResolver {
  constructor(
    private messageService: MessageService,
    private readonly userDao: UserDao,
    @Inject('PUB_SUB') private pubSub: PubSub
  ) {}

  @Query('message')
  async message(@Args('id') id: number): Promise<Message> {
    return this.messageService.findOneById(id);
  }

  @Mutation('postMessage')
  async postMessage(@Args('content') content: string, @Args('senderId') senderId: number, @Args('channel') channel: string): Promise<Message> {

    const sender = await this.userDao.findOneById(senderId);
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

