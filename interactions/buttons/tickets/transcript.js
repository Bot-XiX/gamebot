const discordTranscripts = require('discord-html-transcripts');
const { ref, get, getDatabase } = require('firebase/database');
/**
 * @file Button interaction: transcript
 * @since 1.0.0
*/
module.exports = {
  id: 'transcript',
  /**
* @description Executes when the button with ID transcript is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const transcriptChannel = await get(ref(db, id + '/tickets/config/transcriptChannel')).then((snapshot) => snapshot.val())
    if (transcriptChannel) {
      console.log(transcriptChannel)
      const transcript = await discordTranscripts.createTranscript(interaction.channel)
      const channel = interaction.guild.channels.cache.get(transcriptChannel)
      interaction.reply({
        content: 'Finde das Transkript hier: ' + channel.toString(),
        ephemeral: true
      })
      return channel.send({
        content: 'Hier ist das Transkript des Tickets:',
        files: [transcript]
      })
    }
    const transcript = await discordTranscripts.createTranscript(interaction.channel)
    interaction.reply({
      content: 'Hier ist das Transkript des Tickets:',
      files: [transcript]
    })
  }
}
