const { ChannelType } = require("discord.js")
const { getDatabase, ref, set } = require("firebase/database")

/**
 * @file Button interaction: setTranscriptChannel
 * @since 1.0.0
*/
module.exports = {
  id: 'setTranscriptChannel',
  /**
* @description Executes when the button with ID setTranscriptChannel is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    interaction.reply({
      content: 'Bitte erwähne den Channel oder gib die ID des Channels an, in den die Transkripte gesendet werden sollen.',
      ephemeral: true
    })
    const msg = await collect()
    let channelID
    if (msg.first().mentions.channels.first()) {
      channelID = msg.first().mentions.channels.first().id
    } else {
      channelID = msg.first().content
    }
    if (interaction.guild.channels.cache.get(channelID).type === ChannelType.GuildText) {
      const db = getDatabase()
      const id = interaction.guild.id
      set(ref(db, id + '/tickets/config/transcriptChannel'), channelID)
      interaction.editReply({
        content: 'Der Channel wurde erfolgreich gesetzt.',
        components: []
      })
    } else {
      interaction.editReply({
        content: 'Dies ist kein Textchannel.',
        components: []
      })
    }
  }
}
