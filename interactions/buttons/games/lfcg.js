const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js')
const { ref, getDatabase, get } = require('firebase/database')
/**
 * @file Button interaction: lfcg
 * @since 1.0.0
*/
module.exports = {
  id: 'lfcg',
  /**
* @description Executes when the button with ID lfcg is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const events = interaction.guild.scheduledEvents.cache
    for (const event of events.values()) {
      if (event.description.includes(interaction.user.toString())) {
        return interaction.reply({ content: 'You already have a game scheduled!', ephemeral: true })
      }
    }
    const db = getDatabase()
    const id = interaction.guild.id
    const premiumRole = JSON.stringify(await get(ref(db, id + '/game/premiumRole'))).slice(1, -1)
    const premiumRoleObj = interaction.guild.roles.cache.get(premiumRole)
    if (interaction.member.roles.cache.has(premiumRoleObj.id)) {
      const modal = new ModalBuilder().setCustomId('LFGcustom').setTitle('Custom Game')
      // Add components to modal
      // Create the text input components
      const game = new TextInputBuilder()
        .setCustomId('LFGgame')
        .setPlaceholder('Spiel')
        .setLabel('Spiel')
        .setStyle(1)
        .setRequired(true)
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
        .setCustomId('LFGplayers')
        .setLabel('Wie viele Mitspieler suchst du?')
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
      const row1 = new ActionRowBuilder().addComponents(game)
      const row2 = new ActionRowBuilder().addComponents(day)
      const row3 = new ActionRowBuilder().addComponents(time)
      const row4 = new ActionRowBuilder().addComponents(players)
      const row5 = new ActionRowBuilder().addComponents(description)
      // Add inputs to the modal
      modal.addComponents(row1, row2, row3, row4, row5)
      // Show the modal to the user
      await interaction.showModal(modal)
    } else {
      interaction.reply({ content: 'Du hast darauf kein Zugriff!', ephemeral: true })
    }
  }
}
