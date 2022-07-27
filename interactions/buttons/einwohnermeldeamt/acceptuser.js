const { get, ref, getDatabase } = require('firebase/database')
const target = require('../../modals/einwohnermeldeamt/vorstellung.js')
/**
 * @file Button interaction: acceptuser

 * @since 1.0.0
*/
module.exports = {
  id: 'acceptuser',
  /**
* @description Executes when the button with ID acceptuser is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.guild.members.cache.get(interaction.message.content.split('\n')[0].slice(2).slice(0, -1))
    target.roles.add(interaction.guild.roles.cache.find(r => r.name === 'Tourist'))
    interaction.reply({ content: 'Tourist role added.' })
    const db = getDatabase()
    const id = interaction.guild.id
    const empfangslog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
    if (!empfangslog) {
      interaction.reply({ content: 'No empfangslog channel found.' })
      return
    } else {
      empfangslog.send({
        content: `${interaction.user.tag} hat ${target.user} die Rolle \`Tourist\` hinzugefügt`
      })
    }
  }
}
