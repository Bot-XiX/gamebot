const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
/**
 * @file Slash interaction: checkserver
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkserver')
    .setDescription('Gets all servers in which the bot is in.')
  ,
  /**
* @description Executes when the slash command with ID checkserver is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const embed = new EmbedBuilder()
    const guilds = interaction.client.guilds.cache
    embed.setTitle('Servers')
    embed.setDescription(`I am in ${guilds.size} servers.`)
    for (const guild of guilds) {
      const inviteLink = await guild[1].channels.cache.first().createInvite({ maxAge: 10 * 60 * 1000, maxUses: 1 })
      embed.addFields({ name: guild[1].name, value: `ID: ${guild[1].id}\nInvite: ${inviteLink}` })
    }
    await interaction.reply({ embeds: [embed] })
  }
}
