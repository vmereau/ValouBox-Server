import { Args, Context, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { UserDao } from "../../core/dao/user.dao";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { ChannelService } from "../channel.service";
import { Channel } from "../channel.entity";
import { User } from "../../user/user.entity";
import { UknownUserError } from "../../message/message.errors";
import { Message } from "../../message/message.entity";
import { GqlSubTags } from "../../app.constants";
import { getGraphqlSubscriptionRequestContext } from "../../core/helpers";

export enum ChannelUpdateType {
  NewMessage = "NEW_MESSAGE",
  UserListUpdate = "USER_LIST_UPDATE"
}

export interface ChannelUpdatePayload {
  channelId: number,
  updateType: ChannelUpdateType,
  userList?: User[],
  newMessage?: Message,
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
                    @Context() context): Promise<Channel> {
    const request = context.req;

    const creator: User = request.user;

    if(!creator) {
      throw new UknownUserError();
    }

    return await this.channelService.createChannel(name, creator, request.em);
  }


  @Subscription('channel', {
    filter: (payload: ChannelUpdatePayload, variables: { channelId: string }) => {
      return payload.channelId === Number.parseInt(variables.channelId)
    },
    resolve: (value: ChannelUpdatePayload) => {
      return value;
    }
  })
  async channelSubscription(@Args('channelId') channelId: number,
                            @Context() context) {
    const request = getGraphqlSubscriptionRequestContext(context);
    request["channelId"] = channelId;

    const channel = await this.channelService.findOneById(channelId);
    const joiningUser: User = request.user;
    await this.channelService.joinChannel(joiningUser, channel);

    return this.pubSub.asyncIterableIterator(GqlSubTags.ChannelUpdate);
  }
}

