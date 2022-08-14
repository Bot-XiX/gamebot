/**
 * @file Slash interaction: config
 * @since 1.0.0
*/
const { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Alle Einstellungen.'),
  /**
 * @description Executes when the slash command with ID config is called.

 * @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const configRow = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('config')
          .setPlaceholder('Nothing selected')
          .addOptions([
            {
              label: 'Einwohnermeldeamt',
              description: 'Einwohnermeldeamt Einstellungen',
              value: 'einwohnermeldeamt'
            },
            {
              label: 'Role config',
              description: 'Rolleneinstellungen',
              value: 'roles'
            },
            {
              label: 'Ticket config',
              description: 'Ticketeinstellungen',
              value: 'ticket'
            },
            {
              label: 'Game config',
              description: 'Spieleeinstellungen',
              value: 'games'
            }
          ])
      )
    // Add the row to the message
    interaction.reply({
      content: 'Select an option',
      components: [configRow],
      ephemeral: [],
      attachments: []
    })
  }
}
