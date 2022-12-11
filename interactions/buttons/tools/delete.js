/**
 * @file Button interaction: delete
 * @since 1.0.0
*/
module.exports = {
  id: 'delete',
  /**
  * @description Executes when the button with ID delete is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    try {
      interaction.message.delete()
    } catch {
      interaction.reply({ content: 'Message already deleted.', ephemeral: true })
    }
  }
}
