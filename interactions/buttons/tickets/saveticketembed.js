
const { getDatabase, ref, set } = require('firebase/database')
const prev = require('../../slash/tickets/createticket.js')
/**
 * @file Button interaction: saveticketembed

 * @since 1.0.0
*/
module.exports = {
  id: 'saveticketembed',
  /**
* @description Executes when the button with ID saveticketembed is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const msg = interaction.message
    const ticket = msg.embeds[0]
    console.log(ticket)
    if (!ticket) {
      interaction.reply({ content: 'No ticket found.' })
      return
    }
    const db = getDatabase()
    const id = interaction.guild.id
    await set(ref(db, id + '/tickets/' + msg.id + '/embed'), ticket)
    interaction.reply({ content: 'Ticket saved.' })
    msg.delete()
  }
}
