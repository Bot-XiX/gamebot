const { TextInputBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { ModalBuilder } = require('discord.js')

/**
 * @file Button interaction: vorstellungcustom

 * @since 1.0.0
*/
module.exports = {
  id: 'vorstellungcustom',
  /**
* @description Executes when the button with ID vorstellungcustom is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const modalModal = new ModalBuilder().setCustomId('vorstellungcustom').setTitle('Vorstellung')
    const text = new TextInputBuilder()
      .setCustomId('text')
      .setLabel('Text')
      .setStyle(2)
    modalModal.addComponents(
      new ActionRowBuilder().addComponents(text)
    )
    await interaction.showModal(modalModal)
  }
}
