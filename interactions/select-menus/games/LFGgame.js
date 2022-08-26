const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js')
const { get, ref, getDatabase } = require('firebase/database')

/**
 * @file Select menu interaction: LFGgame
 * @since 1.0.0
*/
module.exports = {
  id: 'LFGgame',
  /**
* @description Executes when the select menu with ID LFGgame is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const game = JSON.stringify(await get(ref(getDatabase(), interaction.guild.id + '/games/' + interaction.values.toString() + '/name'))).slice(1, -1)
    const modal = new ModalBuilder().setCustomId('LFGgame').setTitle(game)
    // Add components to modal
    // Create the text input components
    const day = new TextInputBuilder()
      .setCustomId('LFGdate')
      .setPlaceholder('DD.MM.YYYY')
    // The label is the prompt the user sees for this input
      .setLabel('Datum')
    // Short means only a single line of text
      .setStyle(1)
      .setMinLength(10)
      .setMaxLength(10)
    // An action row only holds one text input,
    const time = new TextInputBuilder()
      .setCustomId('LFGtime')
    // The label is the prompt the user sees for this input
      .setLabel('Uhrzeit')
    // Paragraph means multiple lines of text
      .setStyle(1)
      .setPlaceholder('HH:MM')
      .setMinLength(5)
      .setMaxLength(5)
    const players = new TextInputBuilder()
      .setCustomId(game)
      .setLabel('Spieleranzahl')
      .setStyle(1)
      .setPlaceholder('Anzahl')
      .setRequired(false)
    const description = new TextInputBuilder()
      .setCustomId('LFGdescription')
      .setLabel('Beschreibung')
      .setStyle(1)
      .setPlaceholder('Beschreibung')
      .setRequired(false)
    // An action row only holds one text input,
    // so you need one action row per text input.
    const row1 = new ActionRowBuilder().addComponents(day)
    const row2 = new ActionRowBuilder().addComponents(time)
    const row3 = new ActionRowBuilder().addComponents(players)
    const row4 = new ActionRowBuilder().addComponents(description)
    // Add inputs to the modal
    modal.addComponents(row1, row2, row3, row4)
    // Show the modal to the user
    await interaction.showModal(modal)
  }
}
