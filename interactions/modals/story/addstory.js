/**
 * @file Modal interaction: addStory
 * @since 1.0.0
*/
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
module.exports = {
  id: 'addStory',
  /**
* @description Executes when the modal with ID addStory is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const satz = interaction.fields.getTextInputValue('satz')
    const channel = interaction.guild.channels.cache.get('1018644639504412672')
    const channel2 = interaction.guild.channels.cache.get('1020035934785380453')
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Satz hinzufügen').setCustomId('story').setStyle(ButtonStyle.Primary)
    )
    await channel.bulkDelete(1)
    channel.send({ content: satz, components: [row] })
    channel2.send({ content: satz })
    interaction.reply({ content: 'Satz hinzugefügt!', ephemeral: true })
  }
}
