import { Module } from '@nestjs/common';
import { ChannelService } from "./channel.service";
import { ChannelResolver } from "./graphql/channel.resolver";

@Module({
  providers: [ChannelService, ChannelResolver],
  exports: [ChannelService]
})
export class ChannelModule {}
