const { RateLimitError } = require('discord.js');
/**
 * @file Ready Event File.
 * @since 1.0.0
*/

module.exports = {
  name: 'rateLimit',

  /**
   * @description Executes the block of code when client is ready (bot initialization)
   * @param {Object} client Main Application Client
   */

  execute (info) {
    console.log(1);
  }
}
