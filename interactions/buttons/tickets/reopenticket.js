const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, time } = require('discord.js')
const { get, ref, getDatabase, set, onValue } = require('firebase/database')
/**
 * @file Button interaction: reOpenTicket

 * @since 1.0.0
*/
module.exports = {
  id: 'reOpenTicket',
  /**
  * @description Executes when the button with ID reOpenTicket is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    await interaction.deferReply()
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
    const messages = Array.from(fetch)
    const getConfig = messages[messages.length - 1][1].embeds[0].footer.text.split(' | ')
    const configId = getConfig[1]
    const button = getConfig[2]
    const parentId = JSON.stringify(await get(ref(db, id + '/tickets/config/' + configId + '/buttons/components/' + button + '/channel'))).slice(1, -1)
    const ids = ref(db, id + '/tickets/channels/' + interaction.channel.id + '/permissions')
    const unsub = onValue(ids, async (snapshot) => {
      const permissions = await snapshot.val()
      const map = (Object.keys(permissions).map(key => permissions[key]))
      await channel.setName(`${channelName[1]}-${channelName[2]}`)
      await channel.setParent(interaction.guild.channels.cache.get(parentId), { lockPermissions: false })
      for (let i = 0; i < map.length; i++) {
        if (interaction.guild.roles.cache.get(map[i].id) !== interaction.guild.roles.everyone) {
          if (interaction.guild.roles.cache.find(r => r.name === 'text mute') !== interaction.guild.roles.cache.get(map[i].id)) {
            await channel.permissionOverwrites.edit(map[i].id, {
              ViewChannel: true,
              SendMessages: true,
              ReadMessageHistory: true,
              AttachFiles: true,
              EmbedLinks: true
            })
          }
        }
      }
      unsub()
    })
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
    await interaction.editReply({ embeds: [reopenEmbed] })
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
