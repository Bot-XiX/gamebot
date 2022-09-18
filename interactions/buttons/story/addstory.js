/**
 * @file Sample button interaction
 * @author Felix
 * @since 1.0.0
 */
const { TextInputBuilder, ModalBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
  id: 'story',

  /**
   * @description Executes when the button with ID "vorschlag" is clicked.
   * @author Felix
   * @param {Object} interaction The Interaction Object of the command.
   */

  async execute (interaction) {
    const addStory = new ModalBuilder().setCustomId('addStory').setTitle('Satz hinzufügen')
    // Create the text input components
    const input = new TextInputBuilder()
      .setCustomId('satz')
      // The label is the prompt the user sees for this input
      .setLabel('Satz')
      // Short means only a single line of text
      .setStyle(1);
    // An action row only holds one text input,
    const row2 = new ActionRowBuilder().addComponents(input);
    // Add inputs to the modal
    addStory.addComponents(row2)
    // Show the modal to the user
    await interaction.showModal(addStory)
  }
}
