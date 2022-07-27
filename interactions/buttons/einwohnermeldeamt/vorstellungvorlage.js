const { TextInputBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { ModalBuilder } = require('discord.js')

/**
 * @file Button interaction: vorstellungvorlage

 * @since 1.0.0
*/
module.exports = {
  id: 'vorstellungvorlage',
  /**
* @description Executes when the button with ID vorstellungvorlage is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const modalModal = new ModalBuilder().setCustomId('vorstellung').setTitle('Vorstellung')
    const name = new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Name')
      .setStyle(1)
    const age = new TextInputBuilder()
      .setCustomId('age')
      .setLabel('Alter')
      .setStyle(1)
    const location = new TextInputBuilder()
      .setCustomId('location')
      .setLabel('Wohnort')
      .setStyle(1)
    const gender = new TextInputBuilder()
      .setCustomId('sex')
      .setLabel('Sexualität + Gender/Pronomen')
      .setStyle(2)
    const hobbies = new TextInputBuilder()
      .setCustomId('hobbies')
      .setLabel('Hobbies')
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
