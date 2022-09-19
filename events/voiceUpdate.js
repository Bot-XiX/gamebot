const { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { ref, getDatabase, onValue, set } = require('firebase/database')

module.exports = {
  name: 'voiceStateUpdate',

  /**
   * @description Executes when an user voice state is updated.

   * @param {Object} oldstate Main Application Client
   * @param {Object} newstate Main Application Client
   */

  async execute (oldstate, newstate) {
    const db = getDatabase()
    const data = ref(db, newstate.guild.id + '/customChannels')
    const unsub = onValue(data, async (snapshot) => {
      const channels = await snapshot.val()
      for (const channel in channels) {
        const channelData = channels[channel]
        if (channelData.id === newstate.channelId) {
          const category = newstate.guild.channels.cache.get(newstate.channelId).parent
          const member = newstate.guild.members.cache.get(newstate.id)
          let channelName = channelData.name
          channelName = await channelName.replace('{user}', newstate.member.user.username)
          channelName = await channelName.replace('{users}', channelData.users)
          channelName = await channelName.replace('{server}', newstate.guild.name)
          channelName = await channelName.replace('{category}', category.name)
          newstate.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildVoice,
            parent: category,
            userLimit: channelData.users,
            permissionOverwrites: [{ id: member.id, allow: [PermissionsBitField.Flags.ManageChannels] }]
          }).then(channel => {
            member.voice.setChannel(channel)
            set(ref(db, newstate.guild.id + '/openChannels'), channel.id)
            const configRow = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('customVoiceDecrease')
                  .setLabel('User Anzahl verringern')
                  .setStyle(ButtonStyle.Danger)
                  .setEmoji('➖'),
                new ButtonBuilder()
                  .setCustomId('customVoiceIncrease')
                  .setLabel('User Anzahl erhöhen')
                  .setStyle(ButtonStyle.Success)
                  .setEmoji('➕'),
                new ButtonBuilder()
                  .setCustomId('customVoiceRename')
                  .setLabel('Channel umbenennen')
                  .setStyle(ButtonStyle.Secondary)
                  .setEmoji('📝'),
                new ButtonBuilder()
                  .setCustomId('customVoiceBan')
                  .setLabel('User vom  Channel bannen')
                  .setStyle(ButtonStyle.Danger)
                  .setEmoji('🔨'),
                new ButtonBuilder()
                  .setCustomId('customVoiceOwner')
                  .setLabel('Channel Besitztum ergreifen')
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji('👑')
              )
            channel.send({ content: 'Willkommen im Custom Channel!', components: [configRow] })
          })
        }
      }
      unsub()
    })
    const data2 = ref(db, newstate.guild.id + '/openChannels')
    const unsub2 = onValue(data2, async (snapshot) => {
      const channel = await snapshot.val()
      console.log(channel)
      if (channel === oldstate.channelId) {
        try {
          if (oldstate.channel.members.size === 0) {
            oldstate.channel.delete()
            set(ref(db, newstate.guild.id + '/openChannels'), null)
          }
        } catch {
          return null
        }
      }
      unsub2()
    })
  }
}
