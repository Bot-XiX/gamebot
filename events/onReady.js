/**
 * @file Ready Event File.
 * @since 1.0.0
*/

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
