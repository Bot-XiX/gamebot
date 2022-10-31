const { PermissionsBitField } = require('discord.js')
const { get, ref, getDatabase } = require('firebase/database')
const { collect } = require('utils')
/**
 * @file Button interaction: customVoiceAdd
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceAdd',
  /**
  * @description Executes when the button with ID customVoiceAdd is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const channel = interaction.channel
    const status = await get(ref(getDatabase(), interaction.guild.id + '/openChannels/' + channel.id)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        return false
      }
    })
    if (status !== 1) {
      if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
        interaction.reply({ content: 'Bitte erwähne den User der deinem geschlossen Channel beitreten darf!', ephemeral: true })
        const msg = await collect(interaction.channel, { filter: m => m.author.id === interaction.user.id, time: 30000, max: 1 })
        if (msg.size === 0) return interaction.editReply({ content: 'Du hast zu lange gebraucht!', ephemeral: true })
        const user = msg.first().mentions.members.first()
        msg.first().delete()
        if (user) {
          if (user.user !== interaction.member) {
            try {
              const member = channel.members.get(user.id)
              if (member.voice.channel === channel) {
                interaction.editReply({ content: `${user.toString()} ist bereits in deinem Channel!`, ephemeral: true })
              } else {
                channel.permissionOverwrites.edit(user.id, {
                  Speak: true,
                  Connect: true,
                  ReadMessageHistory: true,
                  SendMessages: true
                })
                interaction.editReply({ content: `${user.toString()} darf deinem Channel nun beitreten!`, ephemeral: true })
              }
            } catch (e) {
              channel.permissionOverwrites.edit(user.id, {
                Connect: true,
                ReadMessageHistory: true,
                SendMessages: true
              })
              interaction.editReply({ content: `${user.toString()} darf deinem Channel nun beitreten!`, ephemeral: true })
            }
          } else {
            interaction.editReply({ content: 'Du kannst dich nicht selbst hinzufügen!', ephemeral: true })
          }
        } else {
          interaction.editReply({ content: 'Du hast keinen User erwähnt!', ephemeral: true })
        }
      } else {
        interaction.reply({ content: 'Du hast keine Berechtigung diesen Channel zu verwalten!', ephemeral: true })
      }
    } else {
      interaction.reply({ content: 'Dies funktioniert nur wenn der Channel geschlossen ist!', ephemeral: true })
    }
  }
}
