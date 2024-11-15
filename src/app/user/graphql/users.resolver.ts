import { Args, Resolver, Query, ResolveField, Parent } from "@nestjs/graphql";
import { UserService } from "../user.service";
import { User } from "../user.entity";
import { MessageService } from "../../message/message.service";
import { ChannelService } from "../../channel/channel.service";

@Resolver('User')
export class UsersResolver {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private channelService: ChannelService
  ) {}

  @Query()
  async user(@Args('id') id: number): Promise<User> {
    return this.userService.findOneById(id);
  }

  @ResolveField()
  async messages(@Parent() user) {
    const { id } = user;
    return this.messageService.findAllByUserId(id);
  }

  @ResolveField()
  async createdChannels(@Parent() user) {
    const { id } = user;
    return this.channelService.findAllByUserId(id);
  }
}
