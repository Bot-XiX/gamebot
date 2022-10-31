const { getDatabase, get, ref } = require('firebase/database')

/**
 * @file Button interaction: customVoiceKick
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceKick',
  /**
  * @description Executes when the button with ID customVoiceKick is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const db = getDatabase()
    const friends = await get(ref(db, `users/${interaction.user.id}/friends`)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        return []
      }
    })
    const channel = interaction.channel
    const members = channel.members
    for (const member of members) {
      if (member[1].id !== interaction.user.id) {
        if (!friends.includes(member[1].id)) {
          try {
            member[1].voice.setChannel(null)
            interaction.channel.permissionOverwrites.edit(member[1].id, { Connect: false, ReadMessageHistory: false, SendMessages: false })
          } catch {
            // Do nothing
          }
        }
      }
    }
    interaction.reply({ content: 'Alle User die nicht deine Freunde sind gekickt.', ephemeral: true })
  }
}
