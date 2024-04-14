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
} from 'necord';
import { Client, Guild, Message } from 'discord.js';
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayer,
} from '@discordjs/voice';

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
    const guildId = interaction.guildId;
    const voiceConnection = this.voiceConnections.get(guildId);
    if (voiceConnection) {
      voiceConnection.disconnect();
      this.voiceConnections.delete(guildId);
      return interaction.reply({
        content: 'Bot desconectado do canal de voz.',
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: 'O bot não está conectado a nenhum canal de voz.',
        ephemeral: true,
      });
    }
  }

  @SlashCommand({
    name: 'lobotomy-kaisen-radio',
    description: 'Summona o Gojo Faraoh',
  })
  public async onRadio(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guildId;
    const guild = interaction.guild as Guild;
    const member = guild.members.resolve(interaction.user);
    const voiceChannel = member?.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply({
        content:
          'Você precisa estar em um canal de voz para usar este comando.',
      });
    }

    const connection = joinVoiceChannel({
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
      ephemeral: true,
    });
    if (message.author === this.client.user) {
      return await interaction.editReply({
        content: "You can't... as long I am the strongest!",
      });
    }
    await message.reply({
      content: `Stand proud ${message.author.username} you are strong!\n`,
    });
    return await interaction.editReply({
      content: 'stand proud enviado!',
    });
  }
}
