const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
/**
 * @file Slash interaction: game
 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('description'), // .addSubcommand((subcommand) => subcommand.setName().setDescription().add...)
  // .addStringOption((option) => option.setName().setDescription().setRequired())
  // .addIntegerOption((option) => option.setName().setDescription().setRequired())
  // .addBooleanOption((option) => option.setName().setDescription().setRequired())
  // .addUserOption((option) => option.setName().setDescription().setRequired())
  // .addChannelOption((option) => option.setName().setDescription().setRequired())
  // .addRoleOption((option) => option.setName().setDescription().setRequired())
  // .addMentionableOption((option) => option.setName().setDescription().setRequired())
  // .addNumberOption((option) => option.setName().setDescription().setRequired())
  // .addAttachmentOption((option) => option.setName().setDescription().setRequired())

  /**
* @description Executes when the slash command with ID game is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Looking for Group')
        .setCustomId('lfg')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎮'),
      new ButtonBuilder()
        .setLabel('Looking for custom Game')
        .setCustomId('lfcg')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('✨')
    )
    interaction.channel.send({
      content: 'Drücke hier um nach einer Gruppe zu suchen',
      components: [row1]
    })
  }
}
