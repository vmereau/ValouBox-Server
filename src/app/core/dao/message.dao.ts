import { Message } from '../../message/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from "../../user/user.entity";

@Injectable()
export class MessageDao {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  // Allow to retrieve the correct Repository if a transaction (entityManager) is given
  private _getRepository(em?: EntityManager): Repository<Message> {
    if (em) {
      return em.getRepository(Message);
    }

    return this.messageRepository;
  }

  public create(
    message: Partial<Message>,
    em?: EntityManager,
  ): Promise<Message> {
    return this._getRepository(em).save(message);
  }

  public findOneById(id: number, em?: EntityManager): Promise<Message> {
    return this._getRepository(em).findOne({
      where: {
        id: id
      }
    });
  }

  public findAllByUserId(userId: number, em?: EntityManager): Promise<Message[]> {
    return this._getRepository(em).find({
      where: {
        sender: {
          id: userId
        }
      }
    });
  }
}
