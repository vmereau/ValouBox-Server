import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Channel } from "../../channel/channel.entity";
import { Message } from "../../message/message.entity";

@Injectable()
export class ChannelDao {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}

  // Allow to retrieve the correct Repository if a transaction (entityManager) is given
  private _getRepository(em?: EntityManager): Repository<Channel> {
    if (em) {
      return em.getRepository(Channel);
    }

    return this.channelRepository;
  }

  public findOneById(id: number, em?: EntityManager): Promise<Channel> {
    return this._getRepository(em).findOne({
      where: {
        id: id
      }
    });
  }

  public create(
    channel: Partial<Channel>,
    em?: EntityManager,
  ): Promise<Channel> {
    return this._getRepository(em).save(channel);
  }

  public findAllByUserId(userId: number, em?: EntityManager): Promise<Channel[]> {
    return this._getRepository(em).find({
      where: {
        creator: {
          id: userId
        }
      }
    });
  }
}
