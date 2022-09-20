/**
 * @file Message Based Commands Handler
 * @since 1.0.0
*/

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
  }
}
