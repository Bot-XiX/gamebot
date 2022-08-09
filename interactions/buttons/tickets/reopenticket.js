const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, time } = require('discord.js')
const { get, ref, getDatabase, set } = require('firebase/database')
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
    const db = getDatabase()
    const id = interaction.guild.id
    const fetch = await interaction.channel.messages.fetch({})
    const msgArray = await Array.from(fetch)
    const lastMsg = msgArray[msgArray.length - 1][1]
    const target = interaction.member
    const targetName = target.user.toString()
    const targetAvatar = target.user.avatarURL()
    interaction.message.edit({ components: [] })
    const channel = interaction.channel
    const channelName = channel.name.split('-')
    channel.setName(`${channelName[1]}-${channelName[2]}`)
    const messages = Array.from(fetch)
    const getConfig = messages[messages.length - 1][1].embeds[0].footer.text.split(' | ')
    const configId = getConfig[1]
    const button = getConfig[2]
    const parentId = JSON.stringify(await get(ref(db, id + '/tickets/config/' + configId + '/buttons/components/' + button + '/channel'))).slice(1, -1)
    channel.setParent(await interaction.guild.channels.cache.get(parentId))
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
    set(ref(db, id + '/tickets/channels/' + interaction.channel.id + '/time'), time())
  }
}
