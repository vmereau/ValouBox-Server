import { Controller, Get, Query } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { User } from "../../graphql";

@Controller('')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('user-list')
  public async userList( @Query('channelId') channelId: number): Promise<User[]> {
    const channel = await this.channelService.findOneById(channelId);

    return this.channelService.getUserList(channel);
  }
}
