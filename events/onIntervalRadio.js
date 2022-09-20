/**
 * @file Ready Event File.
 * @since 1.0.0
*/

const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice')
const { ref, getDatabase, onValue } = require('firebase/database')

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @description Executes the block of code when client is ready (bot initialization)
   * @param {Object} client Main Application Client
   */

  execute (client) {
    const db = getDatabase()
    const data = ref(db, 'radio')
    async function reSub () {
      const unsub = onValue(data, async (snapshot) => {
        const radio = await snapshot.val()
        for (const guild in radio) {
          try {
            const guildData = radio[guild]
            const channel = await client.channels.cache.get(guildData.id)
            const link = await guildData.link
            if (channel) {
              const player = await createAudioPlayer()
              const resource = await createAudioResource(link)
              await player.play(resource)
              const connection = await joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
              })
              await connection.subscribe(player)
            }
          } catch {
            return null
          }
        }
        unsub()
      })
    }
    reSub()
    setInterval(reSub, 1000 * 60 * 30) // Runs every 30 minutes
  }
}
