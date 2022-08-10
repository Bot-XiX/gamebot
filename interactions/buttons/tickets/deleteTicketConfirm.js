/**
 * @file Button interaction: deleteTicketConfirm

 * @since 1.0.0
*/
module.exports = {
  id: 'deleteTicketConfirm',
  /**
  * @description Executes when the button with ID deleteTicketConfirm is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    interaction.reply('Alles klar, das Ticket wird nun gelöscht!')
    const channel = interaction.guild.channels.cache.get(interaction.channel.id)
    setTimeout(() => channel.delete(), 5000)
  }
}
