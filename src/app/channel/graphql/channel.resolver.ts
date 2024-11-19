import { Args, Context, GqlExecutionContext, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { UserDao } from "../../core/dao/user.dao";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { ChannelService } from "../channel.service";
import { Channel } from "../channel.entity";
import { User } from "../../user/user.entity";
import { UknownUserError } from "../../message/message.errors";
import { getGraphqlSubscriptionRequestContext } from "../../core/helpers";
import { MessageAddedPayload } from "../../message/graphql/message.resolver";
import { GglSubTags } from "../../app.constants";

export interface UserListUpdatePayload {
  userList: Set<User>,
  channel: Channel
}

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
  async postChannel(@Args('name') name: string,
                    @Args('creatorId') creatorId: number,
                    @Context() context): Promise<Channel> {
    const request = context.req;

    const creator: User = request.user;

    if(!creator) {
      throw new UknownUserError();
    }

    return await this.channelService.createChannel(name, creator, request.em);
  }

  @Mutation('joinChannel')
  async joinChannel(@Args('channelId') channelId: number,
                    @Context() context): Promise<Set<User>> {
    const request = context.req;

    const joiningUser: User = request.user;
    const channel = await this.channelService.findOneById(channelId);
    const userList = this.channelService.joinChannel(joiningUser, channel);

    await this.pubSub.publish(GglSubTags.UserListUpdate, { userList, channel });

    return userList;
  }

  @Subscription('newMessage', {
    filter: (payload: MessageAddedPayload, variables: { channelId: string }) => {
      return payload.channel.id === Number.parseInt(variables.channelId)
    },
    resolve: (value: MessageAddedPayload) => {
      return value.newMessage;
    }
  })
  async newMessage() {
    return this.pubSub.asyncIterableIterator(GglSubTags.NewMessage);
  }

  @Subscription('userListUpdate', {
    filter: (payload: UserListUpdatePayload, variables: { channelId: string }) => {
      return payload.channel.id === Number.parseInt(variables.channelId)
    },
    resolve: (value: UserListUpdatePayload) => {
      return value.userList;
    }
  })
  async userListUpdate() {
    return this.pubSub.asyncIterableIterator(GglSubTags.UserListUpdate);
  }
}

