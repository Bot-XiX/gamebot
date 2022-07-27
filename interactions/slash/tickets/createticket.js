const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder } = require('@discordjs/builders')
const { ButtonStyle } = require('discord.js')

/**
 * @file Slash interaction: ticket

 * @since 1.0.0
*/
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createticket')
    .setDescription('Create a ticket embed'), // .addSubcommand((subcommand) => subcommand.setName().setDescription().add...)
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
* @description Executes when the slash command with ID ticket is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const ticketEmbed = new EmbedBuilder()
      .setTitle('Placeholder title')
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
    const editEmbedRow = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('editticketembed')
          .setPlaceholder('Nothing selected')
          .addOptions([
            {
              label: 'Title',
              value: 'title'
            },
            {
              label: 'URL',
              value: 'url'
            },
            {
              label: 'Author',
              value: 'author'
            },
            {
              label: 'Description',
              value: 'description'
            },
            {
              label: 'Thumbnail',
              value: 'thumbnail'
            },
            {
              label: 'Color',
              value: 'color'
            },
            {
              label: 'Image',
              value: 'image'
            },
            {
              label: 'Footer',
              value: 'footer'
            }
          ])
      )
    const saveEmbedRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('saveticketembed')
          .setLabel('Save')
          .setStyle(ButtonStyle.Success) // Primary, Secondary, Success, Danger, Link
          // .setEmoji('EMOJI') // If you want to use an emoji
      )
    // Add the row to the message
    // Add the row to the message
    const msg = interaction.reply({
      components: [editEmbedRow, saveEmbedRow],
      attachments: [],
      embeds: [ticketEmbed]
    })
    module.exports.prev = { interaction, ticketEmbed, editEmbedRow, saveEmbedRow, msg }
  }
}
