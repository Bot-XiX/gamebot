/**
 * @file Anonym button interaction
 * @since 1.0.0
*/
const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder
} = require('discord.js')
module.exports = {
  id: 'vorschlag_anonym',

  /**
   * @description Executes when the button with ID "orschlag_anonym" is clicked.

   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    const modal = new ModalBuilder()
      .setCustomId('vorschlag_anonym')
      .setTitle('Anonymer Vorschlag')
    // Add components to modal
    // Create the text input components
    const titel = new TextInputBuilder()
      .setCustomId('titel')
    // The label is the prompt the user sees for this input
      .setLabel('Titel deines Vorschlags')
    // Short means only a single line of text
      .setStyle(1)
    const beschreibung = new TextInputBuilder()
      .setCustomId('beschreibung')
      .setLabel('Beschreibung deines Vorschlags')
    // Paragraph means multiple lines of text.
      .setStyle(2)
    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(titel)
    const secondActionRow = new ActionRowBuilder().addComponents(beschreibung)
    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow)
    // Show the modal to the user
    await interaction.showModal(modal)
  }
}
