import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MessageService } from "../message.service";
import { Message } from "../message.entity";
import { UserDao } from "../../core/dao/user.dao";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { ChannelDao } from "../../core/dao/channel.dao";
import { Channel } from "../../channel/channel.entity";
import { User } from "../../user/user.entity";
import { UknownChannelError, UknownUserError } from "../message.errors";
import { ChannelUpdatePayload, ChannelUpdateType } from "../../channel/graphql/channel.resolver";
import { GqlSubTags } from "../../app.constants";

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
  async postMessage(@Args('content') content: string,
                    @Args('senderId') senderId: number,
                    @Args('channelId') channelId: number,
                    @Context() context): Promise<Message> {
    const request = context.req;

    const sender: User = request.user;
    if(!sender) {
      throw new UknownUserError();
    }

    const channel: Channel = await this.channelDao.findOneById(channelId, request.em);
    if(!channel) {
      throw new UknownChannelError();
    }

    const newMessage: Message = await this.messageService.createMessage(content, channel, sender, request.em);

    const payload: ChannelUpdatePayload = {
      channelId: channel.id,
      updateType: ChannelUpdateType.NewMessage,
      newMessage: newMessage
    }

    await this.pubSub.publish(GqlSubTags.ChannelUpdate, payload);

    return newMessage;
  }
}

