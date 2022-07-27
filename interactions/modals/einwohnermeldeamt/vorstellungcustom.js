const { EmbedBuilder } = require('discord.js')
const { get, ref, getDatabase } = require('firebase/database')

/**
 * @file Modal interaction: vorstellung

 * @since 1.0.0
*/
module.exports = {
  id: 'vorstellungcustom',
  /**
* @description Executes when the modal with ID vorstellung is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const log = interaction.guild.channels.cache.get(JSON.stringify(await get(ref(db, id + '/einwohnermeldeamt/config/vorstellungLog'))).slice(1).slice(0, -1))
    if (interaction.fields.getTextInputValue('text')) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Vorstellung von ${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        })
        .setDescription(interaction.fields.getTextInputValue('text'))
      try {
        log.send({ content: interaction.user.tag, embeds: [embed] })
        interaction.reply({ content: 'Vorstellung wurde gesendet.', ephemeral: true })
      } catch (e) {
        return null
      }
    } else {
      interaction.reply({ content: 'Bitte fülle alle Felder aus.', ephemeral: true })
    }
  }
}
