import { ChannelType, GuildChannel } from 'discord.js';
import { ChannelOption } from 'necord';

export class GuildChannelRadio {
  @ChannelOption({
    name: 'channel',
    description: 'Canal onde a expansão de domínio ocorrerá!',
    required: false,
    channel_types: [ChannelType.GuildVoice],
  })
  channel?: GuildChannel;
}
