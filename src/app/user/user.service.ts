import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { EntityManager } from 'typeorm';
import { UserDao } from '../core/dao/user.dao';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  public async createUser(name: string, em: EntityManager): Promise<User> {
    const newUser: User = new User();
    newUser.name = name;

    return this.userDao.create(newUser, em);
  }
}
