const { SlashCommandBuilder } = require('discord.js')
/**
 * @file Slash interaction: adduser
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('adduser')
    .setDescription('Add a user to a ticket')
    .addUserOption((option) => option.setName('user').setDescription('User').setRequired(true)),

  /**
* @description Executes when the slash command with ID adduser is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.options.getUser('user')
    interaction.channel.permissionOverwrites.edit(target.id, {
      SendMessages: true,
      ViewChannel: true,
      ReadMessageHistory: true,
      AttachFiles: true,
      EmbedLinks: true
    })
    interaction.reply({ content: `User ${target} added to ticket.` })
  }
}
