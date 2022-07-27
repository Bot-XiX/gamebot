
const { getDatabase, ref, set } = require('firebase/database')
/**
 * @file Button interaction: savevorstellungembed

 * @since 1.0.0
*/
module.exports = {
  id: 'savevorstellungembed',
  /**
* @description Executes when the button with ID savevorstellungembed is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const msg = interaction.message
    const vorstellung = msg.embeds[0]
    if (!vorstellung) {
      interaction.reply({ content: 'No embed found.' })
      return
    }
    const db = getDatabase()
    const id = interaction.guild.id
    await set(ref(db, id + '/einwohnermeldeamt/config/vorstellungEmbed'), vorstellung)
    interaction.reply({ content: 'Embed saved.' })
    msg.delete()
  }
}
