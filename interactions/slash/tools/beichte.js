const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
module.exports = {
  // The data needed to register slash commands to Discord.
  data: new SlashCommandBuilder()
    .setName('beichte')
    .setDescription('Placeholder'),
  /**
   * @description Executes when the interaction is called by interaction handler.

   * @param {*} interaction The interaction object of the command.
   */

  async execute (interaction) {
    if (
      interaction.member.roles.cache.some((role) => role.name === 'Technikchef')
    ) {
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Frage')
          .setCustomId('anonyme_frage')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setLabel('Beichte')
          .setCustomId('anonyme_beichte')
          .setStyle(ButtonStyle.Secondary)
      )
      interaction.channel.send({
        content: 'Drücke hier um einen Beichte oder Frage einzureichen',
        components: [row1]
      })
    } else {
      return interaction.reply({
        content: 'No permissions',
        ephemeral: true
      })
    }
  }
}
