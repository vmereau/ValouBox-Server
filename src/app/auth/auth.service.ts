import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';
import { UserDao } from '../core/dao/user.dao';
import { User } from '../user/user.entity';
import { JwtPayload, JwtType } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDao: UserDao,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    name: string,
    password: string,
    em?: EntityManager,
  ): Promise<User> {
    const user = await this.userDao.findOneByName(name, em);

    if (!user) {
      return null;
    }

    const isSamePassword = await bcrypt.compare(password, user?.password);

    if (!isSamePassword) {
      return null;
    }

    const result = { ...user };
    delete result.password;

    return result;
  }

  public generateAccessToken(user: User): string {
    const payload: JwtPayload = { sub: user.id + "", type: JwtType.Access };

    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    });
  }
}
