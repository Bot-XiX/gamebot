const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const prev = require('./createadminticket') // id, execute, execute-->prev

/**
 * @file Button interaction: reopenticket

 * @since 1.0.0
*/
module.exports = {
  id: 'reopenticket',
  /**
  * @description Executes when the button with ID reopenticket is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const fetch = await interaction.channel.messages.fetch({})
    const msgArray = await Array.from(fetch)
    const lastMsg = msgArray[msgArray.length - 1][1]
    const target = interaction.member
    const targetName = target.user.toString()
    const targetAvatar = target.user.avatarURL()
    interaction.message.edit({ components: [] })
    const channel = interaction.channel
    let channelName = channel.name.split('-')
    function wait (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    var startTime = performance.now()
    let endTime
    channel.setName(`${channelName[1]}-${channelName[2]}`).then(async () => {
      endTime = performance.now()
    })
    let timeTaken
    setTimeout(async () => {
      timeTaken = endTime - startTime
    }, 1000)
    await wait(2000)
    const reopenEmbed = new EmbedBuilder()
      .setTitle('Ticket wieder geöffnet')
      .setAuthor({
        name: target.user.username,
        iconURL: targetAvatar
      })
      .setDescription(`Das Ticket wurde durch ${targetName} wieder eröffnet.`)
      .setTimestamp()
      .setFooter({
        text: `Ticket | ${target.user.id}`
      })
    await interaction.reply({ embeds: [reopenEmbed] })
    const rowRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('closeTicket')
          .setLabel('Ticket schließen')
          .setStyle(ButtonStyle.Danger) // Primary, Secondary, Success, Danger, Link
          .setEmoji('🔒') // If you want to use an emoji
      )
    lastMsg.edit({ components: [rowRow] })
    if (isNaN(timeTaken)) {
      reopenEmbed.setDescription(`Das Ticket wurde durch ${targetName} wieder eröffnet.\n⚠️ Achtung, der Channel-Name konnte aufgrund der Discord-Zeitbegrenzung nicht umbenannt werden. ⚠️`)
      interaction.editReply({ embeds: [reopenEmbed] })
    }
  }
}
