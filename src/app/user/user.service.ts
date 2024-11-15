import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { EntityManager } from 'typeorm';
import { UserDao } from '../core/dao/user.dao';
import { BCRYPT_ROUNDS } from "../app.constants";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  public async createUser(name: string, password: string, em: EntityManager): Promise<User> {
    const newUser: User = new User();
    newUser.name = name;
    newUser.password = await bcrypt.hash(password, BCRYPT_ROUNDS);

    return this.userDao.create(newUser, em);
  }

  public async findOneById(id: number): Promise<User> {
    return this.userDao.findOneById(id);
  }
}
