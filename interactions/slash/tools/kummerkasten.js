const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName('kummerkasten')
    .setDescription('Placeholder'),
  /**
   * @description Executes when the interaction is called by interaction handler.

   * @param {*} interaction The interaction object of the command.
   */

  async execute (interaction) {
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Frage')
        .setCustomId('anonymerKummerkasten')
        .setStyle(ButtonStyle.Primary)
    )
    interaction.channel.send({
      content: 'Drücke hier um anonym einen Post zu erstellen',
      components: [row1]
    })
  }
}
