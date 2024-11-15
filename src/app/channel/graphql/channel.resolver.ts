import { Args, Resolver, Query, Mutation, Subscription } from "@nestjs/graphql";
import { UserDao } from "../../core/dao/user.dao";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { ChannelService } from "../channel.service";
import { Channel } from "../channel.entity";
import { User } from "../../user/user.entity";
import { UknownUserError } from "../../message/message.errors";

@Resolver('Channel')
export class ChannelResolver {
  constructor(
    private channelService: ChannelService,
    private readonly userDao: UserDao,
    @Inject('PUB_SUB') private pubSub: PubSub
  ) {}

  @Query('channel')
  async channel(@Args('id') id: number): Promise<Channel> {
    return this.channelService.findOneById(id);
  }

  @Mutation('postChannel')
  async postChannel(@Args('name') name: string, @Args('creatorId') creatorId: number): Promise<Channel> {
    const creator: User = await this.userDao.findOneById(creatorId);
    if(!creator) {
      throw new UknownUserError();
    }

    const newChannel: Channel = await this.channelService.createChannel(name, creator);

    // await this.pubSub.publish('messageAdded', { newMessage, channel });

    return newChannel;
  }

}

