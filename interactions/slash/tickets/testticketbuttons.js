const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js')

/**
 * @file Slash interaction: testbuttons

 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('testticketbuttons')
    .setDescription('Placeholder'), // .addSubcommand((subcommand) => subcommand.setName().setDescription().add...)
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
  * @description Executes when the slash command with ID testbuttons is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Admin')
        .setCustomId('createadminticket')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setLabel('Beschwerde')
        .setCustomId('createcomplaint')
        .setStyle(ButtonStyle.Primary)
    )
    const embedEmbed = new EmbedBuilder()
      .setTitle('Ticket Button test')
    // .setURL('')
    // .setAuthor({
    //        name: '',
    //        iconURL: '',
    //        url: ''
    //    })
    // .setDescription('')
    // .setThumbnail('')
    // .setColor('')
    // .addFields(
    //    { name: '', value: '' },
    //    { name: '', value: '' },
    // )
    // .addField('Inline field title', 'Some value here', true)
    // .setImage('')
    // .setTimestamp()
    // .setFooter({
    //       text: '',
    //       iconURL: ''
    // });
    interaction.channel.send({ embeds: [embedEmbed], components: [row1] })
  }
}
