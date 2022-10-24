const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
/**
 * @file Slash interaction: label
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('anonym')
    .setDescription('Send anonymous messages panel'),
  /**
* @description Executes when the slash command with ID label is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Anonym antworten')
          .setCustomId('anonymantworten')
          .setStyle(ButtonStyle.Secondary)
      )
    await interaction.reply({ content: 'Anonym antworten', components: [row3], ephemeral: false })
  }
}
