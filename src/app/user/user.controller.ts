import { Body, Controller, Get, Post, Req, Query } from "@nestjs/common";
import { Request } from 'express';
import { UserService } from './user.service';
import { UserCreationError } from "./user.errors";
import { User } from "./user.entity";

export interface PostUser {
  name: string;
  password: string;
}

@Controller("")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async postUser(@Req() request: Request, @Body() body: PostUser): Promise<boolean> {
    if (!body.name || !body.password) {
      throw new UserCreationError();
    }

    await this.userService.createUser(body.name, body.password, request.em);

    return true;
  }

  @Get()
  public async findOneById(@Req() request: Request, @Query('id') id: number):  Promise<User> {
    return this.userService.findOneById(id);
  }
}
