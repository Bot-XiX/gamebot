const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, time } = require('discord.js')
// const prev1 = require('./createadminticket')
// const prev2 = require('./createcomplaint')

/**
 * @file Button interaction: closeTicket

 * @since 1.0.0
*/
module.exports = {
  id: 'closeTicket',
  /**
  * @description Executes when the button with ID closeTicket is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const channel = interaction.channel
    const channelName = channel.name
    const target = interaction.member
    const targetName = target.user.toString()
    const targetAvatar = target.user.avatarURL()
    channel.setParent(await interaction.guild.channels.cache.get('1005821144575774750'))
    function wait (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    var startTime = performance.now()
    let endTime
    channel.setName(`🔒-${channelName}`).then(async () => {
      endTime = performance.now()
    })
    let timeTaken
    setTimeout(async () => {
      timeTaken = endTime - startTime
    }, 1000)
    await wait(2000)
    const closedEmbed = new EmbedBuilder()
      .setTitle('Ticket geschlossen')
      .setAuthor({
        name: target.user.username,
        iconURL: targetAvatar
      })
      .setDescription(`Das Ticket wurde durch ${targetName} geschlossen.`)
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
    await interaction.reply({ embeds: [closedEmbed], components: [ticketControls] })
    interaction.message.edit({
      components: []
    })
    if (isNaN(timeTaken)) {
      closedEmbed.setDescription(`Das Ticket wurde durch ${targetName} geschlossen.\n⚠️ Achtung, der Channel-Name konnte aufgrund der Discord-Zeitbegrenzung nicht umbenannt werden. ⚠️`)
      interaction.editReply({ embeds: [closedEmbed] })
    }
  }
}
