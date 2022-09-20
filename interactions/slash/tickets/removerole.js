const { SlashCommandBuilder } = require('discord.js')
/**
 * @file Slash interaction: removerole
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Add a user to a ticket')
    .addRoleOption((option) => option.setName('role').setDescription('Role').setRequired(true)),

  /**
* @description Executes when the slash command with ID removerole is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.options.getRole('role')
    interaction.channel.permissionOverwrites.delete(target.id)
    interaction.reply({ content: `Role ${target} removed from ticket.` })
  }
}
