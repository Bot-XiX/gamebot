const { SlashCommandBuilder } = require('discord.js')
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice')
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
    .addStringOption((option) => option.setName('link').setDescription('Link zum Radio').setRequired(false)),
  /**
* @description Executes when the slash command with ID label is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = await interaction.options.getChannel('channel')
    let link = await interaction.options.getString('link')
    if (!link) {
      link = 'https://live.hunter.fm/lofi_high'
    }
    const player = await createAudioPlayer()
    const resource = await createAudioResource(link)
    await player.play(resource)
    const connection = await joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    })
    await connection.subscribe(player)
    await interaction.reply({ content: 'Radio gestartet', ephemeral: true })
    set(ref(getDatabase(), '/radio/' + interaction.guild.id + '/id'), channel.id)
    set(ref(getDatabase(), '/radio/' + interaction.guild.id + '/link'), link)
  }
}
