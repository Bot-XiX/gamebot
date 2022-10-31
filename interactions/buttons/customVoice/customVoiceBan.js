const { PermissionsBitField } = require('discord.js')
const { collect } = require('utils')
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
    const channel = interaction.channel
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      interaction.reply({ content: 'Bitte erwähne den User der vom Channel gebannt/entbannt werden soll!', ephemeral: true })
      const msg = await collect(interaction.channel, { filter: m => m.author.id === interaction.user.id, time: 30000, max: 1 })
      if (msg.size === 0) return interaction.editReply({ content: 'Du hast zu lange gebraucht!', ephemeral: true })
      const user = msg.first().mentions.members.first()
      msg.first().delete()
      if (user) {
        if (user.user !== interaction.member) {
          try {
            const member = channel.members.get(user.id)
            if (member.voice.channel === channel) {
              if (channel.permissionsFor(user.id).has(PermissionsBitField.Flags.ManageChannels)) return interaction.editReply({ content: `${user.toString()} kann nicht gebannt werden!`, ephemeral: true })
              channel.permissionOverwrites.edit(user.id, {
                Speak: false,
                Connect: false,
                ReadMessageHistory: false,
                SendMessages: false
              })
              interaction.editReply({ content: `${user.toString()} gebannt!`, ephemeral: true })
            } else {
              channel.permissionOverwrites.delete(user.id)
              interaction.editReply({ content: `${user.toString()} vom Channel entbannt!`, ephemeral: true })
            }
            try {
              user.voice.setChannel(null)
            } catch {
              interaction.editReply({ content: `${user.toString()} konnte nicht vom Channel gebannt werden!`, ephemeral: true })
            }
          } catch (e) {
            channel.permissionOverwrites.delete(user.id)
            interaction.editReply({ content: `${user.toString()} vom Channel entbannt!`, ephemeral: true })
          }
        } else {
          interaction.editReply({ content: 'Du kannst dich nicht selbst bannen!', ephemeral: true })
        }
      } else {
        interaction.editReply({ content: 'Du hast keinen User erwähnt!', ephemeral: true })
      }
    } else {
      interaction.reply({ content: 'Du hast keine Berechtigung diesen Channel zu verwalten!', ephemeral: true })
    }
  }

}
