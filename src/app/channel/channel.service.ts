import { Inject, Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import { EntityManager } from "typeorm";
import { Message } from "../message/message.entity";
import { ChannelDao } from "../core/dao/channel.dao";
import { Channel } from "./channel.entity";
import { PubSub } from "graphql-subscriptions";
import { GqlSubTags } from "../app.constants";
import { ChannelUpdatePayload, ChannelUpdateType } from "./graphql/channel.resolver";

@Injectable()
export class ChannelService {

  private activeChannels = new Map<number, User[]>();

  constructor(private readonly channelDao: ChannelDao,
              @Inject('PUB_SUB') private pubSub: PubSub) {}

  public async findOneById(id: number): Promise<Channel> {
    return this.channelDao.findOneById(id);
  }

  public async removeUserFromChannel(user: User, channelId: number) {
    if(!user && !channelId){
      return;
    }

    let activeChannelUserList = this.activeChannels.get(channelId);
    activeChannelUserList = activeChannelUserList.filter((activeUser) => activeUser.id !== user.id);

    if(activeChannelUserList.length === 0){
      this.activeChannels.delete(channelId);
    } else {
      this.activeChannels.set(channelId, activeChannelUserList);
      await this.publishChannelUserListUpdate(channelId, activeChannelUserList);
    }
  }

  public async joinChannel(user: User, channel: Channel): Promise<User[]> {
    if(!this.activeChannels.has(channel.id)) {
      this.activeChannels.set(channel.id, []);
    }

    const userList = this.activeChannels.get(channel.id);
    userList.push(user)

    await this.publishChannelUserListUpdate(channel.id, userList);

    return userList;
  }

  public getUserList(channel): User[] | undefined {
    return this.activeChannels.get(channel.id);
  }

  public async createChannel(
    name: string,
    creator: User,
    em?: EntityManager,
  ): Promise<Channel> {
    const newChannel: Channel = new Channel();
    newChannel.name = name;
    newChannel.creator = creator;

    return this.channelDao.create(newChannel, em);
  }

  public async findAllByUserId(userId: number): Promise<Channel[]> {
    return this.channelDao.findAllByUserId(userId);
  }

  private async publishChannelUserListUpdate(channelId: number, userList: User[]) {
    const payload: ChannelUpdatePayload = {
      updateType: ChannelUpdateType.UserListUpdate,
      channelId: channelId,
      userList: userList
    }

    await this.pubSub.publish(GqlSubTags.ChannelUpdate, payload);
  }
}
