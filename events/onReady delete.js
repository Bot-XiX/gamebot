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
    function deleteThis () {
      let objDate = new Date();
      let hours = objDate.getHours();
      let check = 0
      if (hours === 21) {
        while (check === 0) {
          try {
            const channel = client.channels.cache.get('1021142137380814920')
            channel.bulkDelete(100)
          } catch {
            check = 1
            return null
          }
        }
      }
    }
    client.setInterval(deleteThis(), 1000*10) // Runs every 1 hour
  }
}
