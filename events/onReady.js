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
    const date = new Date()
    // eslint-disable-next-line no-console
    console.log(`Ready! Logged in as ${client.user.tag}\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
  }
}
