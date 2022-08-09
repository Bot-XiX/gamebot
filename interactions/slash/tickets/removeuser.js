const { SlashCommandBuilder } = require('discord.js')
/**
 * @file Slash interaction: removeuser
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeuser')
    .setDescription('Add a user to a ticket')
    .addUserOption((option) => option.setName('user').setDescription('User').setRequired(true)),

  /**
* @description Executes when the slash command with ID removeuser is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.options.getUser('user')
    interaction.channel.permissionOverwrites.delete(target.id)
    interaction.reply({ content: `User ${target} removed from ticket.` })
  }
}
