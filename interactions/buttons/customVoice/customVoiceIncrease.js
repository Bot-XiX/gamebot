const { PermissionsBitField } = require("discord.js")
/**
 * @file Button interaction: customVoiceIncrease
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceIncrease',
  /**
* @description Executes when the button with ID customVoiceIncrease is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.guild.channels.cache.get(interaction.channelId)
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      channel.edit({ userLimit: channel.userLimit + 1 })
      interaction.reply({ content: 'Benutzerlimit um 1 erhöht!', ephemeral: true })
    }
  }
}
