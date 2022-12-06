const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { ref, getDatabase, set, get } = require('firebase/database')

module.exports = {
  name: 'voiceStateUpdate',

  /**
   * @description Executes when an user voice state is updated.

   * @param {Object} oldState Main Application Client
   * @param {Object} newState Main Application Client
   */

  async execute (oldState, newState) {
    const db = getDatabase()
    const customChannels = await get(ref(db, newState.guild.id + '/customChannels')).then((snapshot) => {
      return snapshot.val()
    })
    for (const channel in customChannels) {
      const channelData = customChannels[channel]
      if (channelData.id === newState.channelId) {
        const category = newState.guild.channels.cache.get(newState.channelId).parent
        const member = newState.guild.members.cache.get(newState.id)
        let channelName = channelData.name
        channelName = await channelName.replace('{user}', newState.member.displayName)
        channelName = await channelName.replace('{users}', channelData.users)
        channelName = await channelName.replace('{server}', newState.guild.name)
        channelName = await channelName.replace('{category}', category.name)
        newState.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildVoice,
          parent: category,
          userLimit: channelData.users
        }).then(async channel => {
          await channel.lockPermissions()
          await channel.permissionOverwrites.edit(member.id, { ManageChannels: true })
          member.voice.setChannel(channel)
          set(ref(db, newState.guild.id + '/openChannels/' + channel.id), 1)
          const configRow1 = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('customVoiceIncrease')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('➕'),
              new ButtonBuilder()
                .setCustomId('customVoiceDecrease')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('➖'),
              new ButtonBuilder()
                .setCustomId('customVoiceRename')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📝'),
              new ButtonBuilder()
                .setCustomId('customVoiceLock')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔐'),
              new ButtonBuilder()
                .setCustomId('customVoiceAdd')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔑')
            )
          const configRow2 = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('customVoiceBan')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔨'),
              new ButtonBuilder()
                .setCustomId('customVoiceFriends')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🫂'),
              new ButtonBuilder()
                .setCustomId('customVoiceGame')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🎮'),
              // new ButtonBuilder()
              //   .setCustomId('customVoiceRegion')
              //   .setStyle(ButtonStyle.Secondary)
              //   .setEmoji('🌍'),
              new ButtonBuilder()
                .setCustomId('customVoiceOwner')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('👑'),
              new ButtonBuilder()
                .setCustomId('customVoiceHelp')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('❓')
            )
          channel.send({ content: `Willkommen im Custom Channel ${member}!`, components: [configRow1, configRow2] })
        })
      }
    }
    const openChannels = await get(ref(db, oldState.guild.id + '/openChannels')).then((snapshot) => {
      return snapshot.val()
    })
    for (const channel in openChannels) {
      if (channel === oldState.channelId) {
        try {
          if (oldState.channel.members.size === 0) {
            await oldState.channel.delete()
            set(ref(db, newState.guild.id + '/openChannels/' + oldState.channelId), null)
          }
        } catch {
          return null
        }
      }
    }
  }
}
