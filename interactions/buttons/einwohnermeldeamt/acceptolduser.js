const { get, ref, getDatabase } = require('firebase/database')
/**
 * @file Button interaction: acceptolduser

 * @since 1.0.0
*/
module.exports = {
  id: 'acceptolduser',
  /**
* @description Executes when the button with ID acceptolduser is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const target = interaction.guild.members.cache.get(interaction.message.content.split('\n')[0].slice(2).slice(0, -1))
    target.roles.add(interaction.guild.roles.cache.find(r => r.name === 'Tourist'))
    target.roles.add(interaction.guild.roles.cache.find(r => r.name === 'Einwohner:in'))
    interaction.reply({ content: 'Tourist + Einwohner:in role added.', ephemeral: true })
    const db = getDatabase()
    const id = interaction.guild.id
    const empfangslog = interaction.member.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/eLog'))).slice(1).slice(0, -1))
    if (!empfangslog) {
      interaction.editReply({ content: 'No empfangslog channel found.' })
      return
    } else {
      empfangslog.send({
        content: `${interaction.user.tag} hat ${target.user} die Rolle \`Tourist + Einwohner:in\` hinzugefügt`
      })
    }
    const embed = (interaction.message.embeds[0])
    embed.data.color = 3066993
    try {
      await interaction.message.edit({ components: [], embed: [embed] })
    } catch {
      return null
    }
  }
}
