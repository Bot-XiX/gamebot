const { PermissionsBitField } = require('discord.js')

/**
 * @file Button interaction: customVoiceOwner
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceOwner',
  /**
* @description Executes when the button with ID customVoiceOwner is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.guild.channels.cache.get(interaction.channelId)
    if (!channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      const members = []
      for (const member of channel.members) {
        if (channel.permissionsFor(member[1].id).has(PermissionsBitField.Flags.ManageChannels)) {
          members.push(member[1].id)
        }
      }
      if (members.length > 0) {
        interaction.reply({ content: 'Der Channel Owner oder ein Teammitglied ist noch im Channel!', ephemeral: true })
      } else {
        const map = channel.permissionOverwrites.cache
        const first = [...map][0]
        await channel.permissionOverwrites.delete(first[0])
        await channel.permissionOverwrites.edit(interaction.user.id, { ManageChannels: true })
        interaction.reply({ content: `${interaction.user} ist nun der Channel Owner` })
      }
    } else {
      interaction.reply({ content: 'Dieser Channel gehört dir schon!', ephemeral: true })
    }
  }
}
