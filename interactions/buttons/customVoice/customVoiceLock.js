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
    await interaction.deferReply({ ephemeral: true })
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
          await channel.permissionOverwrites.edit(member, { Connect: true, ReadMessageHistory: true, SendMessages: true })
        }
        for (const friend of friends) {
          if (channel.permissionsFor(friend).has(PermissionsBitField.Flags.Speak)) {
            channel.permissionOverwrites.edit(friend, { Connect: true, ReadMessageHistory: true, SendMessages: true })
          }
        }
        await channel.permissionOverwrites.edit(interaction.user.id, { ManageChannels: true })
        for (const user of permissions) {
          const check1 = user[0] !== interaction.guild.roles.everyone.id
          const check2 = !members.includes(user[0])
          const check3 = !bans.includes(user[0])
          const check4 = !friends.includes(user[0])
          const check5 = !channel.permissionsFor(user[0]).has(PermissionsBitField.Flags.ManageChannels)
          if (check1 && check2 && check3 && check4 && check5) {
            channel.permissionOverwrites.delete(user[0])
          }
        }
        set(ref(db, interaction.guild.id + '/openChannels/' + channel.id), 2)
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('customVoiceKick')
            .setLabel('Nicht-Freunde kicken')
            .setStyle(ButtonStyle.Danger)
        )
        interaction.editReply({ content: 'Nur noch deine Freunde können diesem Channel beitreten!', components: [row], ephemeral: true })
        const row1 = interaction.message.components[0]
        const row2 = interaction.message.components[1]
        const newRow1 = new ActionRowBuilder()
        for (const button of row1.components) {
          if (button.customId === 'customVoiceLock') {
            const newButton = ButtonBuilder.from(button).setEmoji('🔒')
            newRow1.addComponents(newButton)
          } else {
            newRow1.addComponents(button)
          }
        }
        interaction.message.edit({ components: [newRow1, row2] })
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
          await channel.permissionOverwrites.edit(member, { Connect: true, ReadMessageHistory: true, SendMessages: true })
        }
        await channel.permissionOverwrites.edit(interaction.user.id, { ManageChannels: true })
        for (const user of permissions) {
          const check1 = user[0] !== interaction.guild.roles.everyone.id
          const check2 = !members.includes(user[0])
          const check3 = !bans.includes(user[0])
          const check5 = !channel.permissionsFor(user[0]).has(PermissionsBitField.Flags.ManageChannels)
          if (check1 && check2 && check3 && check5) {
            channel.permissionOverwrites.delete(user[0])
          }
        }
        interaction.editReply({ content: 'Dieser Channel ist nun für alle geschlossen!', ephemeral: true })
        const row1 = interaction.message.components[0]
        const row2 = interaction.message.components[1]
        const newRow1 = new ActionRowBuilder()
        for (const button of row1.components) {
          if (button.customId === 'customVoiceLock') {
            const newButton = ButtonBuilder.from(button).setEmoji('🔓')
            newRow1.addComponents(newButton)
          } else {
            newRow1.addComponents(button)
          }
        }
        interaction.message.edit({ components: [newRow1, row2] })
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
        interaction.editReply({ content: 'Du hast den Raum geöffnet!', ephemeral: true })
        const row1 = interaction.message.components[0]
        const row2 = interaction.message.components[1]
        const newRow1 = new ActionRowBuilder()
        for (const button of row1.components) {
          if (button.customId === 'customVoiceLock') {
            const newButton = ButtonBuilder.from(button).setEmoji('🔐')
            newRow1.addComponents(newButton)
          } else {
            newRow1.addComponents(button)
          }
        }
        interaction.message.edit({ components: [newRow1, row2] })
        set(ref(db, interaction.guild.id + '/openChannels/' + channel.id), 1)
      }
    } else {
      interaction.editReply({ content: 'Du hast keine Berechtigung diesen Channel zu verwalten!', ephemeral: true })
    }
  }
}
