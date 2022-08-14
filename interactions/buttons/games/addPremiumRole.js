const { getDatabase, set, ref } = require("firebase/database")

/**
 * @file Button interaction: addPremiumRole
 * @since 1.0.0
*/
module.exports = {
  id: 'addPremiumRole',
  /**
* @description Executes when the button with ID addPremiumRole is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    interaction.reply({
      content: 'Bitte erwähne die Premium Rolle.',
      ephemeral: true
    })
    const msg = await collect()
    const content = msg.first().content.slice(3, -1)
    const role = interaction.guild.roles.cache.get(content)
    if (role === undefined) {
      interaction.editReply({
        content: 'Diese Rolle existiert nicht.',
        ephemeral: true
      })
    } else {
      set(ref(getDatabase(), interaction.guild.id + '/game/premiumRole'), role.id)
      interaction.editReply({
        content: 'Rolle hinzugefügt.'
      })
      msg.first().delete()
    }
  }
}
