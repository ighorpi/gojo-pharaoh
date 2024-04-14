import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  Context,
  On,
  Once,
  ContextOf,
  SlashCommandContext,
  SlashCommand,
  MessageCommandContext,
  TargetMessage,
  MessageCommand,
  Options,
  UserCommand,
  TargetUser,
  UserCommandContext,
} from 'necord';
import {
  Client,
  EmbedBuilder,
  Guild,
  Message,
  PermissionFlagsBits,
  PermissionsBitField,
  User,
} from 'discord.js';
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayer,
} from '@discordjs/voice';
import { GuildChannelRadio } from './dto/radio';

@Injectable()
export class AppUpdate implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppUpdate.name);
  private voiceConnections: Map<string, VoiceConnection> = new Map();
  private readonly audioPlayer: AudioPlayer;
  public constructor(private readonly client: Client) {
    this.audioPlayer = createAudioPlayer();
  }

  onApplicationBootstrap() {
    const stream = 'assets/MENANCE.webm';
    let resource = createAudioResource(stream);
    this.audioPlayer.play(resource);
    this.audioPlayer.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
        resource = createAudioResource(stream);
        this.audioPlayer.play(resource);
      }
    });
  }

  @Once('ready')
  public onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @SlashCommand({
    name: 'desconectar',
    description: 'Desconecta o bot do canal de voz',
  })
  public async desconectar(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const guildId = interaction.guildId;
    const voiceConnection = this.voiceConnections.get(guildId);
    if (voiceConnection) {
      voiceConnection.disconnect();
      this.voiceConnections.delete(guildId);
      return interaction.editReply({
        content: 'Bot desconectado do canal de voz.',
      });
    } else {
      return interaction.editReply({
        content: 'O bot não está conectado a nenhum canal de voz.',
      });
    }
  }

  @SlashCommand({
    name: 'lobotomy-kaisen-radio',
    description: 'Summona o Gojo Faraoh',
  })
  public async onRadio(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: GuildChannelRadio,
  ) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guildId;
    const guild = interaction.guild as Guild;
    const member = guild.members.resolve(interaction.user);
    const voiceChannel = member?.voice.channel;

    if (!voiceChannel && !channel) {
      return interaction.editReply({
        content:
          'Você precisa estar em um canal de voz ou selecionar um canal de voz para usar esse comando.',
      });
    }
    const connection = channel
      ? joinVoiceChannel({
          channelId: channel.id,
          guildId: guildId,
          adapterCreator: guild.voiceAdapterCreator,
        })
      : joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guildId,
          adapterCreator: guild.voiceAdapterCreator,
        });

    connection.on(VoiceConnectionStatus.Ready, () => {
      interaction.editReply({
        content: 'Bot conectado ao canal de voz.',
      });
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      this.voiceConnections.delete(guildId);
    });

    this.voiceConnections.set(guildId, connection);

    try {
      //   const audioPlayer = createAudioPlayer({});
      //   const resource = createAudioResource('assets/MENANCE.webm');
      //   audioPlayer.play(resource);

      connection.subscribe(this.audioPlayer);

      return interaction.editReply({
        content: "Nah, I'd win!",
      });
    } catch (error) {
      console.error('Erro ao reproduzir som:', error);
      return interaction.editReply({
        content: 'Ocorreu um erro ao reproduzir o som.',
      });
    }
  }

  @MessageCommand({
    name: 'Stand Proud',
  })
  async standProud(
    @Context() [interaction]: MessageCommandContext,
    @TargetMessage() message: Message,
  ) {
    await interaction.deferReply({
      ephemeral: false,
    });
    if (message.author === this.client.user) {
      const embed = new EmbedBuilder()
        .setTitle("You can't... as long I am the strongest!")
        .setImage(
          'https://media1.tenor.com/m/EVm3lHlEbd4AAAAC/gojo-jujutsu-kaisen.gif',
        );
      return await interaction.editReply({
        embeds: [embed],
      });
    }
    const embed = new EmbedBuilder()
      .setTitle(`Stand proud, you are strong!\n`)
      .setImage(
        'https://media1.tenor.com/m/6PzHzhNng_AAAAAC/sukuna-ryomen-sukuna.gif',
      );
    await message.reply({
      embeds: [embed],
    });
    return await interaction.editReply({
      content: '<:gege:1199925880626106368>',
    });
  }

  @MessageCommand({
    name: 'You Are My Special',
  })
  async youAreMySpecial(
    @Context() [interaction]: MessageCommandContext,
    @TargetMessage() message: Message,
  ) {
    await interaction.deferReply({
      ephemeral: false,
    });
    if (message.author === this.client.user) {
      const embed = new EmbedBuilder()
        .setTitle("You can't... as long I am the strongest!")
        .setImage(
          'https://media1.tenor.com/m/EVm3lHlEbd4AAAAC/gojo-jujutsu-kaisen.gif',
        );
      return await interaction.editReply({
        embeds: [embed],
      });
    }
    const embed = new EmbedBuilder()
      .setTitle(`You Are My Special!`)
      .setImage(
        'https://media1.tenor.com/m/RRjpRxZN69YAAAAC/jujutsu-kaisen-jjk.gif',
      );
    await message.reply({
      embeds: [embed],
    });
    return await interaction.editReply({
      content: '<:gege:1199925880626106368>',
    });
  }

  @MessageCommand({
    name: 'You Are So Right',
  })
  async youAreRight(
    @Context() [interaction]: MessageCommandContext,
    @TargetMessage() message: Message,
  ) {
    await interaction.deferReply({
      ephemeral: false,
    });
    if (message.author === this.client.user) {
      const embed = new EmbedBuilder()
        .setTitle("You can't... as long I am the strongest!")
        .setImage(
          'https://media1.tenor.com/m/EVm3lHlEbd4AAAAC/gojo-jujutsu-kaisen.gif',
        );
      return await interaction.editReply({
        embeds: [embed],
      });
    }
    const embed = new EmbedBuilder()
      .setTitle(`Is It? Maybe? You are so right!`)
      .setImage('https://media1.tenor.com/m/c67XWC0HaEwAAAAd/gojo-toji.gif');
    await message.reply({
      embeds: [embed],
    });
    return await interaction.editReply({
      content: '<:gege:1199925880626106368>',
    });
  }

  @MessageCommand({
    name: "Nah, I'd Win",
  })
  async nahIdWin(
    @Context() [interaction]: MessageCommandContext,
    @TargetMessage() message: Message,
  ) {
    await interaction.deferReply({
      ephemeral: false,
    });
    if (message.author === this.client.user) {
      const embed = new EmbedBuilder()
        .setTitle("You can't... as long I am the strongest!")
        .setImage(
          'https://media1.tenor.com/m/EVm3lHlEbd4AAAAC/gojo-jujutsu-kaisen.gif',
        );
      return await interaction.editReply({
        embeds: [embed],
      });
    }
    const embed = new EmbedBuilder()
      .setTitle(`Nah, I'd win!`)
      .setImage(
        'https://media1.tenor.com/m/8UntVSgyu6QAAAAC/gojo-satoru-satoru-gojo.gif',
      );
    await message.reply({
      embeds: [embed],
    });
    return await interaction.editReply({
      content: '<:gege:1199925880626106368>',
    });
  }
}
