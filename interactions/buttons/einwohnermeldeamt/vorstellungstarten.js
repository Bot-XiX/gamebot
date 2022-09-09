const { TextInputBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { ModalBuilder } = require('discord.js')

/**
 * @file Button interaction: vorstellungstarten

 * @since 1.0.0
*/
module.exports = {
  id: 'vorstellungstarten',
  /**
* @description Executes when the button with ID vorstellungstarten is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const modalModal = new ModalBuilder().setCustomId('vorstellung').setTitle('Vorstellung')
    const name = new TextInputBuilder()
      .setCustomId('nameAndAge')
      .setLabel('Wie heißt du und wie alt bist du?')
      .setStyle(1)
    const age = new TextInputBuilder()
      .setCustomId('location')
      .setLabel('Wo wohnst du? (Bundesland ausreichend)')
      .setStyle(1)
    const location = new TextInputBuilder()
      .setCustomId('sexuality')
      .setLabel('Was ist deine Sexualität?')
      .setStyle(1)
    const gender = new TextInputBuilder()
      .setCustomId('gender')
      .setLabel('Was ist dein Gender bzw. Pronomen?')
      .setStyle(2)
    const hobbies = new TextInputBuilder()
      .setCustomId('hobbies')
      .setLabel('Was sind deine Hobbies?')
      .setStyle(2)
    // Add inputs to the modal
    modalModal.addComponents(
      new ActionRowBuilder().addComponents(name),
      new ActionRowBuilder().addComponents(age),
      new ActionRowBuilder().addComponents(location),
      new ActionRowBuilder().addComponents(gender),
      new ActionRowBuilder().addComponents(hobbies)
    )
    // Show the modal to the user
    await interaction.showModal(modalModal)
  }
}
