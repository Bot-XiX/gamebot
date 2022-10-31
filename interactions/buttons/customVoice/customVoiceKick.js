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
    const friends = get(ref(db, `users/${interaction.user.id}/friends`))
    const channel = interaction.channel
    const members = channel.members
    for (const member of members) {
      if (member[1].id !== interaction.user.id) {
        if (!friends.includes(member[1].id)) {
          try {
            member[1].voice.setChannel(null)
          } catch {
            // Do nothing
          }
        }
      }
    }
  }
}
