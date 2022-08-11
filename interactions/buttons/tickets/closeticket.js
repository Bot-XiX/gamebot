const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, time } = require('discord.js')
const { get, ref, getDatabase, set } = require('firebase/database')
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
    await interaction.deferReply()
    const db = getDatabase()
    const id = interaction.guild.id
    const timer = JSON.stringify(await get(ref(db, id + '/tickets/channels/' + interaction.channel.id + '/time'))).slice(4, -2)
    const times = time().slice(3, -1) - timer
    if (times < 600) {
      interaction.editReply({ content: `You can only a ticket every 10 minutes.\n Please wait another ${Math.floor((600 - times) / 60)} minutes.`, ephemeral: true })
    } else {
      const channel = interaction.channel
      const channelName = channel.name
      const target = interaction.member
      const targetName = target.user.toString()
      const targetAvatar = target.user.avatarURL()
      const fetch = await interaction.channel.messages.fetch({
      })
      const array = Array.from(interaction.channel.permissionOverwrites.cache)
      for (let i = 0; i < array.length; i++) {
        await set(ref(db, id + '/tickets/channels/' + interaction.channel.id + '/permissions/' + array[i][0] + '/id'), array[i][1].id)
      }
      const messages = Array.from(fetch)
      const getConfig = messages[messages.length - 1][1].embeds[0].footer.text.split(' | ')
      const configId = getConfig[1]
      const button = getConfig[2]
      const parentId = JSON.stringify(await get(ref(db, id + '/tickets/config/' + configId + '/buttons/components/' + button + '/closedChannel'))).slice(1, -1)
      const modRole = JSON.stringify(await get(ref(db, id + '/tickets/config/' + configId + '/buttons/components/' + button + '/modRole'))).slice(1, -1)
      channel.setParent(await interaction.guild.channels.cache.get(parentId), { lockPermissions: false })
      const map = channel.permissionOverwrites.cache
      const mapArray = Array.from(map)
      for (let i = 0; i < mapArray.length; i++) {
        await set(ref(db, id + '/tickets/channels/' + interaction.channel.id + '/permissions/' + mapArray[i][0] + '/id'), mapArray[i][1].id)
      }
      for (let i = 0; i < mapArray.length; i++) {
        if (interaction.guild.roles.cache.get(mapArray[i][1].id) !== interaction.guild.roles.everyone) {
          await channel.permissionOverwrites.delete(mapArray[i][1].id)
        }
      }
      channel.permissionOverwrites.edit(modRole, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      })
      channel.setName(`🔒-${channelName}`).then(async () => {
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
              .setCustomId('reOpenTicket')
              .setLabel('Wieder öffnen')
              .setStyle(ButtonStyle.Primary) // Primary, Secondary, Success, Danger, Link
              .setEmoji('🔓'), // If you want to use an emoji
            new ButtonBuilder()
              .setCustomId('deleteTicket')
              .setLabel('Löschen')
              .setStyle(ButtonStyle.Danger) // Primary, Secondary, Success, Danger, Link
              .setEmoji('🗑️') // If you want to use an emoji
          )
        await interaction.editReply({ embeds: [closedEmbed], components: [ticketControls] })
        interaction.message.edit({
          components: []
        })
      })
    }
  }
}
