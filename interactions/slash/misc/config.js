/**
 * @file Slash interaction: config
 * @since 1.0.0
*/
const { SlashCommandBuilder } = require('@discordjs/builders')
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

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
              label: 'Anonymisierung',
              description: 'Anonymisierung Einstellungen',
              value: 'anonym'
            },
            {
              label: 'Role config',
              description: 'Rolleneinstellungen',
              value: 'roleconfig'
            },
            {
              label: 'Ticket config',
              description: 'Ticketeinstellungen',
              value: 'ticketconfig'
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
