const { getDatabase, set, ref } = require('firebase/database')

/**
 * @file Button interaction: addGameWaitingChannel
 * @since 1.0.0
*/
module.exports = {
  id: 'addGameWaitingChannel',
  /**
* @description Executes when the button with ID addGameWaitingChannel is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    interaction.reply({
      content: 'Bitte schreibe die VoiceID, für den Wartebereich.',
      ephemeral: true
    })
    const msg = await collect()
    const voiceId = msg.first().content
    const voiceChannel = interaction.guild.channels.cache.get(voiceId)
    if (voiceChannel === undefined) {
      interaction.editReply({
        content: 'Dieser Voicechannel existiert nicht.',
        ephemeral: true
      })
    } else {
      set(ref(getDatabase(), interaction.guild.id + '/game/waitingChannel'), voiceChannel.id)
      interaction.editReply({
        content: 'Wartebereich hinzugefügt.'
      })
      msg.first().delete()
    }
  }
}
