const { PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
/**
 * @file Button interaction: customVoiceRegion
 * @since 1.0.0
*/
module.exports = {
  id: 'customVoiceRegion',
  /**
* @description Executes when the button with ID customVoiceRegion is called.
* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const channel = interaction.channel
    if (channel.permissionsFor(interaction.user.id).has(PermissionsBitField.Flags.ManageChannels)) {
      interaction.client.fetchVoiceRegions()
        .then(regions => {
          const regionSelect = new StringSelectMenuBuilder()
            .setCustomId('CVregionSelect')
            .setPlaceholder('Region auswählen')
            .setMinValues(1)
            .setMaxValues(1)
          regionSelect.addOptions({ label: 'Automatisch', value: 'auto' })
          for (const region of regions) {
            regionSelect.addOptions({ label: region[1].name, value: region[1].id, description: region[1].description })
          }
          const regionRow = new ActionRowBuilder().addComponents(regionSelect)
          interaction.reply({ content: 'Wähle eine Region aus:', components: [regionRow], ephemeral: true })
        })
    }
  }
}
