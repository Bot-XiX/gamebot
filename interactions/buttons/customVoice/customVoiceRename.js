const { TextInputBuilder, ModalBuilder, ActionRowBuilder } = require("discord.js");
const { PermissionsBitField } = require("discord.js")
/**
 * @file Button interaction: customVoiceRename
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceRename',
  /**
* @description Executes when the button with ID customVoiceRename is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.guild.channels.cache.get(interaction.channelId)
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      const modalModal = new ModalBuilder().setCustomId('customVoiceRename').setTitle('Channel umbenen');
      // Add components to modal
      // Create the text input components
      const input = new TextInputBuilder()
        .setCustomId('newName')
        .setLabel('Neuer Channel Name')
        .setStyle(1);
      const inputRow = new ActionRowBuilder().addComponents(input);
      modalModal.addComponents(inputRow);
      await interaction.showModal(modalModal);
    }
  }
}
