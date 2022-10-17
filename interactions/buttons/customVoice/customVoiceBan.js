const { PermissionsBitField } = require('discord.js')
/**
 * @file Button interaction: customVoiceBan
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceBan',
  /**
* @description Executes when the button with ID customVoiceBan is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    const channel = interaction.guild.channels.cache.get(interaction.channelId)
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      interaction.reply({ content: 'Bitte erwähne den User der vom Channel gebannt werden soll!', ephemeral: true })
      const msg = await collect()
      const user = msg.first().mentions.members.first()
      msg.first().delete()
      if (user) {
        if (user.user !== interaction.member) {
          try {
            const member = channel.members.get(user.id)
            if (member.voice.channel === channel) {
              console
              channel.permissionOverwrites.edit(user.id, {
                Connect: false,
                ReadMessageHistory: false,
                SendMessages: false
              })
              interaction.editReply({ content: 'User gebannt!', ephemeral: true })
            } else {
              interaction.reply({ content: 'Der User ist nicht in diesem Channel!', ephemeral: true })
            }
            try {
              user.voice.setChannel(null)
            } catch {
              interaction.editReply({ content: 'User konnte nicht vom Channel gebannt werden!', ephemeral: true })
            }
          } catch {
            interaction.editReply({ content: 'Der User ist nicht in diesem Channel!', ephemeral: true })
          }
        } else {
          interaction.editReply({ content: 'User ist nicht in diesem Channel!', ephemeral: true })
        }
      } else {
        interaction.editReply({ content: 'Du kannst dich nicht selbst bannen!', ephemeral: true })
      }
    } else {
      interaction.editReply({ content: 'Du hast keinen User erwähnt!', ephemeral: true })
    }
  }

}
