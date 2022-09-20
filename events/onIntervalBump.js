/**
 * @file Ready Event File.
 * @since 1.0.0
*/

const { get, ref, getDatabase, onValue, remove } = require('firebase/database')

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @description Executes the block of code when client is ready (bot initialization)
   * @param {Object} client Main Application Client
   */

  execute (client) {
    const db = getDatabase()
    async function checkBump () {
      try {
        const bump = await ref(db, 'bump')
        const unsub = onValue(bump, async (snapshot) => {
          const bumpData = await snapshot.val()
          for (const guildId in bumpData) {
            try {
              const guild = await client.guilds.cache.get(guildId)
              const channel = await guild.channels.cache.get(bumpData[guildId].channel)
              const timestamp = JSON.stringify(await get(ref(db, `bump/${guildId}/nextBump`)))
              const date = new Date()

              if (timestamp < date.getTime()) {
                await remove(ref(db, `bump/${guildId}/nextBump`))
                const role = await guild.roles.cache.get(bumpData[guildId].role)
                let reminder = await bumpData[guildId].bumpReady
                let channelName = await bumpData[guildId].channelReady
                const category = channel.parent
                channelName = await channelName.replace('{role}', role.name)
                channelName = await channelName.replace('{server}', guild.name)
                channelName = await channelName.replace('{category}', category.name)
                try {
                  channel.edit({ name: channelName })
                } catch {
                  return null
                }
                reminder = await reminder.replace('{role}', role)
                reminder = reminder.replaceAll('\\n', '\n')
                reminder = await reminder.replace('{server}', guild.name)
                reminder = await reminder.replace('{category}', category.name)
                reminder = await reminder.replace('{channel}', channel.name)
                await channel.bulkDelete(1)
                await channel.send(reminder)
              }
            } catch {
              return null
            }
          }
          unsub()
          // channel.send(`${role} wieder möglich. Nutze /bump, um den Server zu bumpen!`)
          // channel.edit({ name: '🤜﹞bump-me-now' })
          // console.log('Bump wieder möglich\n\n\n\n\n')
        })
      } catch {
        return null
      }
    }
    setInterval(checkBump, 1000 * 10) // Runs every 60 seconds
  }
}
