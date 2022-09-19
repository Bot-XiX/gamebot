/**
 * @file Modal interaction: customVoiceRename
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceRename',
  /**
* @description Executes when the modal with ID customVoiceRename is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.guild.channels.cache.get(interaction.channelId)
    channel.edit({ name: interaction.fields.getTextInputValue('newName') })
    interaction.reply({ content: 'Channel umbenannt!', ephemeral: true })
  }
}
