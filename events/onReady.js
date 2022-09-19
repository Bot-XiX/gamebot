/**
 * @file Ready Event File.
 * @since 1.0.0
*/

const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel } = require('@discordjs/voice')
const { get, ref, getDatabase, onValue } = require("firebase/database")

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @description Executes the block of code when client is ready (bot initialization)
   * @param {Object} client Main Application Client
   */

  execute (client) {
    // eslint-disable-next-line no-console
    console.log(`Ready! Logged in as ${client.user.tag}`)
    // dashboard.run()
    const db = getDatabase()
    const data = ref(db, 'radio')
    const unsub = onValue(data, async (snapshot) => {
      const radio = await snapshot.val()
      for (const guild in radio) {
        const guildData = radio[guild]
        const channel = client.channels.cache.get(guildData.id)
        const link = guildData.link
        console.log(channel.id, link)
        if (channel) {
          const player = createAudioPlayer({
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause
            }
          })
          const resource = createAudioResource(link)
          player.play(resource)
          const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
          })
          connection.subscribe(player)
        }
      }
      unsub()
    })
    async function deleteThis () {
      const objDate = new Date()
      const hours = objDate.getHours()
      let check = 0
      if (hours === 5) {
        while (check === 0) {
          try {
            const channel = client.channels.cache.get('1011003542095548436')
            await channel.bulkDelete(100)
            return null
          } catch {
            check = 1
            return null
          }
        }
      }
    }
    setInterval(deleteThis, 1000 * 60 * 10) // Runs every 10 minutes
  }
}
