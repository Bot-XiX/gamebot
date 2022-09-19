/**
 * @file Message Based Commands Handler
 * @since 1.0.0
*/

const { get, ref, getDatabase } = require('firebase/database')

module.exports = {
  name: 'messageCreate',

  /**
   * @description Executes when a message is created and handle it.

   * @param {Object} message The message which was created.
   */
  async execute (message) {
    // Declares const to be used.

    const { client } = message

    // Checks if the bot is mentioned in the message all alone and triggers onMention trigger.
    // You can change the behavior as per your liking at ./messages/onMention.js

    if (
      message.content === `<@${client.user.id}>` ||
      message.content === `<@!${client.user.id}>`
    ) {
      require('../messages/onMention').execute(message)
    }
    const channel = message.guild.channels.cache.get(JSON.stringify(await get(ref(getDatabase(), message.guild.id + '/bump/channel'))).slice(1, -1))
    try {
      if (message.channel.id === channel.id) {
        console.log(message)
        if (message.embeds[0]) {
          let date = new Date()
          let timestamp = date.getTime()
          timestamp = timestamp + 1000 * 60 * 60 * 2
          timestamp = Math.floor(timestamp / 1000)
          date = new Date(timestamp * 1000)
          const hour = date.getHours()
          let minute = date.getMinutes()
          if (minute < 10) {
            minute = '0' + minute
          }
          const user = message.interaction.user
          message.channel.bulkDelete(2)
          message.channel.send({ content: `Danke fürs Bumpen ${user}! ♥️` })
          message.channel.send({ content: `Nächster Bump in <t:${timestamp}>` })
          message.channel.edit({ name: `⏰﹞☾${hour}┊${minute}☽` })
        }
      }
    } catch {
      return null
    }
  }
}
