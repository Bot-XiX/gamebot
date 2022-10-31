const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { getDatabase, get, ref, set } = require('firebase/database')

/**
 * @file Button interaction: customVoiceLock
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceLock',
  /**
  * @description Executes when the button with ID customVoiceLock is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const channel = interaction.channel
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      const db = getDatabase()
      const friends = await get(ref(db, `users/${interaction.user.id}/friends`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return []
        }
      })
      const status = await get(ref(db, interaction.guild.id + '/openChannels/' + channel.id)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return false
        }
      })
      if (status === 1) {
        for (const friend of friends) {
          if (channel.permissionsFor(friend).has(PermissionsBitField.Flags.Speak)) {
            channel.permissionOverwrites.edit(friend, { Connect: true, ReadMessageHistory: true, SendMessages: true })
          }
        }
        set(ref(db, interaction.guild.id + '/openChannels/' + channel.id), 2)
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('customVoiceKick')
            .setLabel('Nicht-Freunde kicken')
            .setStyle(ButtonStyle.Danger)
        )
        interaction.reply({ content: 'Nur noch deine Freunde können diesem Channel beitreten!', components: [row], ephemeral: true })
      } else if (status === 2) {
        const permissions = channel.permissionOverwrites.cache
        let bans = []
        for (const user of permissions) {
          if (user[0] !== interaction.guild.roles.everyone.id) {
            if (!channel.permissionsFor(user[0]).has(PermissionsBitField.Flags.Speak)) {
              bans = bans.concat(user[0])
            }
          }
        }
        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false, ReadMessageHistory: false, SendMessages: false })
        const members = channel.members.map((member) => member.id)
        for (const member of members) {
          if (!permissions.has(member)) {
            channel.permissionOverwrites.edit(member, { ReadMessageHistory: true, SendMessages: true })
          }
        }
        for (const user of permissions) {
          if (user[0] !== interaction.guild.roles.everyone.id && !members.includes(user[0]) && !bans.includes(user[0])) channel.permissionOverwrites.delete(user[0])
        }
        for (const ban of bans) {
          channel.permissionOverwrites.edit(ban, { Connect: false, ReadMessageHistory: true, SendMessages: true })
        }
        interaction.reply({ content: 'Dieser Channel ist nun für alle geschlossen!', ephemeral: true })
        set(ref(db, interaction.guild.id + '/openChannels/' + channel.id), 3)
      } else if (status === 3) {
        const permissions = channel.permissionOverwrites.cache
        let bans = []
        for (const user of permissions) {
          if (user[0] !== interaction.guild.roles.everyone.id) {
            if (!channel.permissionsFor(user[0]).has(PermissionsBitField.Flags.Speak)) {
              bans = bans.concat(user[0])
            }
          }
          channel.lockPermissions()
          for (const ban of bans) {
            channel.permissionOverwrites.edit(ban, { Connect: false, ReadMessageHistory: false, SendMessages: false })
          }
        }
        interaction.reply({ content: 'Du hast den Raum geöffnet!', ephemeral: true })
        set(ref(db, interaction.guild.id + '/openChannels/' + channel.id), 1)
      }
    } else {
      interaction.reply({ content: 'Du hast keine Berechtigung diesen Channel zu verwalten!', ephemeral: true })
    }
  }
}
