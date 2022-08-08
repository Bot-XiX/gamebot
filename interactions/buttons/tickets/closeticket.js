const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js')
const prev = require('./createadminticket')

/**
 * @file Button interaction: closeticket

 * @since 1.0.0
*/
module.exports = {
  id: 'closeticket',
  /**
  * @description Executes when the button with ID closeticket is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const channel = interaction.guild.channels.cache.get(interaction.channel.id)
    const channelName = channel.name
    const target = interaction.member
    const targetName = target.user.toString()
    const targetAvatar = target.user.avatarURL()
    channel.setParent(interaction.guild.channels.cache.get('1005821144575774750'))
    channel.setName(`🔒-${channelName}`)
    const closedEmbed = new EmbedBuilder()
      .setTitle('Ticket geschlossen')
      // .setURL('')
      .setAuthor({
        name: target.user.username,
        iconURL: targetAvatar
      })
      .setDescription(`Das Ticket wurde durch ${targetName} geschlossen.`)
      // .setThumbnail('')
      // .setColor('')
      // .addFields(
      //    { name: '', value: '' },
      //    { name: '', value: '' },
      // )
      // .addField('Inline field title', 'Some value here', true)
      // .setImage('')
      .setTimestamp()
      .setFooter({
        text: `Ticket | ${target.user.id}`
      })
    const ticketControls = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reopenticket')
          .setLabel('Wieder öffnen')
          .setStyle(ButtonStyle.Primary) // Primary, Secondary, Success, Danger, Link
          .setEmoji('🔓'), // If you want to use an emoji
        new ButtonBuilder()
          .setCustomId('deleteticket')
          .setLabel('Löschen')
          .setStyle(ButtonStyle.Danger) // Primary, Secondary, Success, Danger, Link
          .setEmoji('🗑️') // If you want to use an emoji
      )
    interaction.reply({ embeds: [closedEmbed], components: [ticketControls] })
    interaction.message.edit({
      components: []
    })
  }
}
