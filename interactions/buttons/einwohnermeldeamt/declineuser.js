const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js')
/**
 * @file Button interaction: declineuser

 * @since 1.0.0
*/
module.exports = {
  id: 'declineuser',
  /**
* @description Executes when the button with ID declineuser is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.guild.members.cache.get(interaction.message.content.split('\n')[0].slice(2).slice(0, -1))
    const reasonModal = new ModalBuilder().setCustomId('ve2Reason').setTitle('VE2 Grund')
    // Add components to modal
    // Create the text input components
    const reason = new TextInputBuilder()
      .setCustomId('reason')
    // The label is the prompt the user sees for this input
      .setLabel('Grund')
    // Short means only a single line of text
      .setStyle(2)
    // An action row only holds one text input,
    const reasonRow = new ActionRowBuilder().addComponents(reason)
    // Add inputs to the modal
    reasonModal.addComponents(reasonRow)
    // Show the modal to the user
    await interaction.showModal(reasonModal)
    const embed = interaction.message.embeds[0]
    module.exports.prev = { target, embed, interaction }
  }
}
