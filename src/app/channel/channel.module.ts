import { Module } from '@nestjs/common';
import { ChannelService } from "./channel.service";
import { ChannelResolver } from "./graphql/channel.resolver";
import { ChannelController } from "./channel.controller";

@Module({
  providers: [ChannelService, ChannelResolver],
  exports: [ChannelService],
  controllers: [ChannelController]
})
export class ChannelModule {}
