import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserCreationError } from "./user.errors";

export interface PostUser {
  name: string;
  password: string;
}

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async postUser(
    @Req() request: Request,
    @Body() body: PostUser,
  ): Promise<boolean> {
    if (!body.name || !body.password) {
      throw new UserCreationError();
    }

    await this.userService.createUser(body.name, body.password, request.em);

    return true;
  }
}
