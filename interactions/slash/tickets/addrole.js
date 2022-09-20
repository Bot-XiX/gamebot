const { SlashCommandBuilder } = require('discord.js')
/**
 * @file Slash interaction: addrole
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a user to a ticket')
    .addRoleOption((option) => option.setName('role').setDescription('Role').setRequired(true)),

  /**
* @description Executes when the slash command with ID addrole is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.options.getRole('role')
    interaction.channel.permissionOverwrites.edit(target.id, {
      SendMessages: true,
      ViewChannel: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      EmbedLinks: true
    })
    interaction.reply({ content: `Role ${target} added to ticket.` })
  }
}
