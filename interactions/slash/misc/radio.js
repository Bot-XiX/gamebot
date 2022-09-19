const { SlashCommandBuilder } = require('discord.js')
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel } = require('@discordjs/voice')
const { getDatabase, ref, set } = require('firebase/database')
/**
 * @file Slash interaction: label
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('radio')
    .setDescription('Stelle den Radio-Channel ein')
    .addChannelOption((option) => option.setName('channel').setDescription('Channel in dem 24/7 Musik gespielt wird').setRequired(true))
    .addStringOption((option) => option.setName('link').setDescription('Link zum Radio').setRequired(true)),
  /**
* @description Executes when the slash command with ID label is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.options.getChannel('channel')
    console.log(channel)
    const link = interaction.options.getString('link')
    console.log(link)
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })
    console.log(player)
    const resource = createAudioResource(link)
    console.log(resource)
    player.play(resource)
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    })
    console.log(connection)
    connection.subscribe(player)
    await interaction.reply({ content: 'Radio gestartet', ephemeral: true })
    set(ref(getDatabase(), '/radio/' + interaction.guild.id + '/id'), channel.id)
    set(ref(getDatabase(), '/radio/' + interaction.guild.id + '/link'), link)
  }
}
