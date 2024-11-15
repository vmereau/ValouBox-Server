import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../user/user.entity';

@Injectable()
export class UserDao {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Allow to retrieve the correct Repository if a transaction (entityManager) is given
  private _getRepository(em?: EntityManager): Repository<User> {
    if (em) {
      return em.getRepository(User);
    }

    return this.userRepository;
  }

  public create(user: Partial<User>, em?: EntityManager): Promise<User> {
    return this._getRepository(em).save(user);
  }

  public findOneByName(name: string, em?: EntityManager): Promise<User> {
    return this._getRepository(em).findOne({
      where: {
        name: name,
      },
    });
  }

  public findOneById(id: number, em?: EntityManager): Promise<User> {
    return this._getRepository(em).findOne({
      where: {
        id: id
      }
    });
  }
}
