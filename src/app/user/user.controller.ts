import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';

export interface PostUser {
  name: string;
}

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async postUser(
    @Req() request: Request,
    @Body() body: PostUser,
  ): Promise<User> {
    return this.userService.createUser(body.name, request.em);
  }
}
