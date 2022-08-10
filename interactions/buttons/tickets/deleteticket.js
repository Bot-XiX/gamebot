const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

/**
 * @file Button interaction: deleteTicket

 * @since 1.0.0
*/
module.exports = {
  id: 'deleteTicket',
  /**
  * @description Executes when the button with ID deleteTicket is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const rowRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('deleteTicketConfirm')
          .setLabel('Löschen')
          .setStyle(ButtonStyle.Danger) // Primary, Secondary, Success, Danger, Link
          .setEmoji('🗑️'), // If you want to use an emoji
        new ButtonBuilder()
          .setCustomId('cancelButton')
          .setLabel('Abbrechen')
          .setStyle(ButtonStyle.Secondary) // Primary, Secondary, Success, Danger, Link
      )
    // Add the row to the message
    interaction.reply({
      content: 'Möchtest du das Ticket wirklich löschen?',
      embeds: [],
      components: [rowRow]
    })
  }
}
