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
    async function reSub () {
      const unsub = onValue(data, async (snapshot) => {
        const radio = await snapshot.val()
        for (const guild in radio) {
          try {
            const guildData = radio[guild]
            const channel = client.channels.cache.get(guildData.id)
            const link = guildData.link
            if (channel) {
              const player = await createAudioPlayer({
                behaviors: {
                  noSubscriber: NoSubscriberBehavior.Pause
                }
              })
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
    setInterval(reSub, 1000 * 60 * 10) // Runs every 10 minutes
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
    async function checkBump () {
      try {
        const guild = client.guilds.cache.get('1000066569776402492')
        JSON.stringify(await get(ref(db, guild.id + '/bump/channel/'))).slice(1, -1)
        const channel = client.channels.cache.get(JSON.stringify(await get(ref(db, guild.id + '/bump/channel/'))).slice(1, -1))
        channel.messages.fetch({ limit: 1 }).then(async messages => {
          let lastMessage = messages.first().content;
          lastMessage = lastMessage.slice(17, -3) * 1000
          const date = new Date()
          if (lastMessage < date.getTime()) {
            const role = guild.roles.cache.get(JSON.stringify(await get(ref(getDatabase(), guild.id + '/bump/role'))).slice(1, -1))
            await channel.bulkDelete(1)
            channel.send(`${role} wieder möglich. Nutze /bump, um den Server zu bumpen!`)
            channel.edit({ name: '🤜﹞bump-me-now' })
            console.log('Bump wieder möglich\n\n\n\n\n')
          }
        })
      } catch (e) {
        return null
      }
    }
    setInterval(checkBump, 1000 * 10) // Runs every 10 seconds
  }
}
