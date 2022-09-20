/**
 * @file Message Based Commands Handler
 * @since 1.0.0
*/

const { get, ref, getDatabase, set } = require('firebase/database')

module.exports = {
  name: 'messageCreate',

  /**
   * @description Executes when a message is created and handle it.

   * @param {Object} message The message which was created.
   */
  async execute (message) {
    async function delBotMsgs () {
      const fetch = await message.channel.messages.fetch({ limit: 10 })
      const { client } = message
      const messages = fetch.filter(m => m.author.id === client.user.id)
      try {
        messages.first().delete()
      } catch {
        return null
      }
    }
    const channel = message.guild.channels.cache.get(JSON.stringify(await get(ref(getDatabase(), 'bump/' + message.guild.id + '/channel'))).slice(1, -1))
    try {
      if (message.channel.id === channel.id) {
        if (message.embeds[0]) {
          let bumpWait = JSON.stringify(await get(ref(getDatabase(), 'bump/' + message.guild.id + '/bumpWait'))).slice(1, -1)
          let bumpChannelWait = JSON.stringify(await get(ref(getDatabase(), 'bump/' + message.guild.id + '/channelWait'))).slice(1, -1)
          let bumpThanks = JSON.stringify(await get(ref(getDatabase(), 'bump/' + message.guild.id + '/thanks'))).slice(1, -1)
          const bumpDelEmbed = await get(ref(getDatabase(), 'bump/' + message.guild.id + '/delEmbed'))
          const bumpRole = message.guild.roles.cache.get(JSON.stringify(await get(ref(getDatabase(), 'bump/' + message.guild.id + '/role'))).slice(1, -1))
          let date = new Date()
          const currentTimestamp = date.getTime()
          const time = currentTimestamp + 1000 * 60 * 60 * 2
          const timestamp = Math.floor(time / 1000)
          date = new Date(timestamp * 1000)
          let hour = date.getHours()
          if (hour < 10) {
            hour = '0' + hour
          }
          let minute = date.getMinutes()
          if (minute < 10) {
            minute = '0' + minute
          }
          let user
          try {
            user = message.interaction.user
          } catch {
            return
          }
          if (bumpThanks) {
            bumpThanks = bumpThanks.replace('{user}', user)
            bumpThanks = bumpThanks.replace('{timestamp}', '<t:' + Math.floor(currentTimestamp / 1000) + ':T>')
            bumpThanks = bumpThanks.replace('{role}', bumpRole)
            bumpThanks = bumpThanks.replace('{server}', message.guild.name)
            bumpThanks = bumpThanks.replace('{category}', message.channel.parent.name)
            bumpThanks = bumpThanks.replace('{channel}', message.channel)
            bumpThanks = bumpThanks.replaceAll('\\n', '\n')
            message.channel.send({ content: bumpThanks })
          }
          if (bumpDelEmbed) {
            try {
              await message.channel.bulkDelete(2)
            } catch {
              delBotMsgs()
            }
          } else {
            delBotMsgs()
          }
          if (bumpChannelWait) {
            bumpChannelWait = bumpChannelWait.replace('{user}', user)
            bumpChannelWait = bumpChannelWait.replace('{role}', bumpRole)
            bumpChannelWait = bumpChannelWait.replace('{hour}', hour)
            bumpChannelWait = bumpChannelWait.replace('{minute}', minute)
            bumpChannelWait = bumpChannelWait.replace('{server}', message.guild.name)
            bumpChannelWait = bumpChannelWait.replace('{category}', message.channel.parent.name)
            try {
              message.channel.edit({ name: bumpChannelWait })
            } catch {
              return null
            }
          }
          if (bumpWait) {
            bumpWait = bumpWait.replace('{user}', user)
            bumpWait = bumpWait.replace('{role}', bumpRole)
            bumpWait = bumpWait.replace('{timestamp}', '<t:' + timestamp + ':R>')
            bumpWait = bumpWait.replace('{server}', message.guild.name)
            bumpWait = bumpWait.replace('{category}', message.channel.parent.name)
            bumpWait = bumpWait.replace('{channel}', message.channel)
            bumpWait = bumpWait.replaceAll('\\n', '\n')
            message.channel.send({ content: bumpWait })
          }
          set(ref(getDatabase(), 'bump/' + message.guild.id + '/nextBump'), time)
        } else {
          if (!message.author.bot) {
            await message.channel.bulkDelete(1)
          }
        }
      }
    } catch {
      return null
    }
  }
}
