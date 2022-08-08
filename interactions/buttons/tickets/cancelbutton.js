/**
 * @file Button interaction: cancelbutton
 * @since 1.0.0
*/
module.exports = {
  id: 'cancelbutton',
  /**
  * @description Executes when the button with ID cancelbutton is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    interaction.reply({ content: 'Die Aktion wurde abgebrochen.', ephemeral: true })
    interaction.message.delete()
  }
}
