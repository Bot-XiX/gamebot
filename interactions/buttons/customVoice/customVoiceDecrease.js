const { PermissionsBitField } = require('discord.js')
/**
 * @file Button interaction: customVoiceDecrease
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceDecrease',
  /**
* @description Executes when the button with ID customVoiceDecrease is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.guild.channels.cache.get(interaction.channelId)
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      if(channel.userLimit > 0) {
        channel.edit({ userLimit: channel.userLimit - 1 })
        interaction.reply({ content: 'Benutzerlimit um 1 verringert!', ephemeral: true })
      }
    }
  }
}
