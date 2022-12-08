const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const { ref, getDatabase, onValue } = require('firebase/database')

/**
 * @file Select menu interaction: configCustomChannel
 * @since 1.0.0
*/
module.exports = {
  id: 'configCustomChannel',
  /**
* @description Executes when the select menu with ID configCustomChannel is called.

* @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    const customChannel = await ref(db, id + '/customChannels')
    const channelSelectMenu = new SelectMenuBuilder()
      .setCustomId('configCustomChannel')
      .setPlaceholder('Nothing selected')
    const unsub = onValue(customChannel, async (snapshot) => {
      const channels = snapshot.val()
      channelSelectMenu.addOptions([{ label: 'Channel hinzufügen', value: 'addChannel' }])
      for (const channel in channels) {
        const name = interaction.guild.channels.cache.get(channels[channel].id).name
        channelSelectMenu.addOptions([{ label: channels[channel].id, description: name, value: channel }])
      }
      const configRow = new ActionRowBuilder().addComponents(channelSelectMenu)
      interaction.reply({
        content: 'Was magst du anpassen?',
        components: [configRow],
        embeds: [],
        ephemeral: true,
        attachments: []
      })
      unsub()
    })
  }
}
unnecessary
