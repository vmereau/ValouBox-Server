import { Injectable } from '@nestjs/common';
import { User } from "../user/user.entity";
import { EntityManager } from "typeorm";
import { Message } from "../message/message.entity";
import { ChannelDao } from "../core/dao/channel.dao";
import { Channel } from "./channel.entity";

@Injectable()
export class ChannelService {

  private activeChannels = new Map<Channel, Set<User>>();

  constructor(private readonly channelDao: ChannelDao) {}

  public async findOneById(id: number): Promise<Channel> {
    return this.channelDao.findOneById(id);
  }

  public joinChannel(user: User, channel: Channel): Set<User> {
    if(!this.activeChannels.has(channel)) {
      this.activeChannels.set(channel, new Set());
    }

    const userList = this.activeChannels.get(channel);
    userList.add(user);

    return userList;
  }

  public getUserList(channel): Set<User> | undefined {
    return this.activeChannels.get(channel);
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
}
