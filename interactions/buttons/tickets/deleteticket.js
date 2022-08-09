const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

/**
 * @file Button interaction: deleteticket

 * @since 1.0.0
*/
module.exports = {
  id: 'deleteticket',
  /**
  * @description Executes when the button with ID deleteticket is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const rowRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('deleteticketconfirmed')
          .setLabel('Löschen')
          .setStyle(ButtonStyle.Danger) // Primary, Secondary, Success, Danger, Link
          .setEmoji('🗑️'), // If you want to use an emoji
        new ButtonBuilder()
          .setCustomId('cancelbutton')
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
