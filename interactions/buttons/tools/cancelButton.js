/**
 * @file Button interaction: cancelButton
 * @since 1.0.0
*/
module.exports = {
  id: 'cancelButton',
  /**
  * @description Executes when the button with ID cancelButton is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    interaction.reply({ content: 'Die Aktion wurde abgebrochen.', ephemeral: true })
    interaction.message.delete()
  }
}
