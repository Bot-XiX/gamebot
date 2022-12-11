const discordTranscripts = require('discord-html-transcripts');
const { Attachment } = require('discord.js');
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
    // create a transcript of the ticket
    const transcript = await discordTranscripts.createTranscript(interaction.channel)
    interaction.reply({
      content: 'Hier ist das Transkript des Tickets:',
      files: [transcript]
    })
  }
}
