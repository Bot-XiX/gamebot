
const { getDatabase, ref, set, update } = require('firebase/database')
/**
 * @file Button interaction: saveTicketEmbed

 * @since 1.0.0
*/
module.exports = {
  id: 'saveTicketEmbed',
  /**
* @description Executes when the button with ID saveTicketEmbed is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const msg = interaction.message
    const embed = msg.embeds[0]
    const buttons = msg.components[2]
    const db = getDatabase()
    const id = interaction.guild.id
    await set(ref(db, id + '/tickets/config/' + msg.id + '/embed'), embed)
    await update(ref(db, id + '/tickets/config/' + msg.id + '/buttons/data'), buttons)
    await set(ref(db, id + '/tickets/config/' + msg.id + '/name'), embed.title)
    interaction.reply({ content: '**Ticket saved**\nID: ' + msg.id })
    msg.delete()
  }
}
