/**
 * @file Sample button interaction
 * @since 1.0.0
*/
const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder
} = require('discord.js')
module.exports = {
  id: 'anonyme_beichte',

  /**
   * @description Executes when the button with ID "anonym" is clicked.

   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    const modal = new ModalBuilder()
      .setCustomId('anonyme_beichte')
      .setTitle('Anonyme Beichte')
    // Add components to modal
    // Create the text input components
    const titel = new TextInputBuilder()
      .setCustomId('titel')
    // The label is the prompt the user sees for this input
      .setLabel('Titel deiner Beichte')
    // Short means only a single line of text
      .setStyle(1)
    const beschreibung = new TextInputBuilder()
      .setCustomId('beschreibung')
      .setLabel('Beschreibung deiner Beichte')
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
