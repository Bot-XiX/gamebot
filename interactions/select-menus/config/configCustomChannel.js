const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const { set, ref, getDatabase, remove, onValue } = require('firebase/database')
const prev = require('./config')

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
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    try {
      prev.prev.interaction.editReply({
        components: [interaction.message.components[0]]
      })
      const db = getDatabase()
      const id = interaction.guild.id
      if (interaction.values.includes('addChannel')) {
        interaction.reply({
          content: 'Bitte sende die Channel-ID',
          ephemeral: true
        })
        const msg = await collect()
        const channelID = msg.first().content
        interaction.editReply({
          content: 'Bitte gib an wie viele User standardmäßig in den Channel kommen dürfen.'
        })
        msg.first().delete()
        const msg2 = await collect()
        const channelUsers = msg2.first().content
        interaction.editReply({
          content: 'Bitte gib den Standard Channel Namen an.\n Nutze `{user}` um den User Namen einzufügen.\n Nutze `{users}` um die Anzahl der User einzufügen.\n Nutze `{server}` um den Servernamen einzufügen.\n Nutze `{category}` um die Kategorie Namen einzufügen.'
        })
        msg2.first().delete()
        const msg3 = await collect()
        const channelName = msg3.first().content
        msg3.first().delete()
        await set(ref(db, id + '/customChannels/' + channelID + '/id'), channelID)
        await set(ref(db, id + '/customChannels/' + channelID + '/users'), channelUsers)
        await set(ref(db, id + '/customChannels/' + channelID + '/name'), channelName)
        interaction.editReply({
          content: 'Der Channel wurde erfolgreich hinzugefügt.'
        })
      } else {
        remove(ref(db, id + '/customChannels/' + interaction.values[0]))
        interaction.reply({ content: 'Channel gelöscht!', ephemeral: true })
      }
      const channels = await ref(db, id + '/customChannels')
      const channelSelectMenu = new SelectMenuBuilder()
        .setCustomId('configCustomChannel')
        .setPlaceholder('Nothing selected')
      const unsub = onValue(channels, async (snapshot) => {
        const channels = snapshot.val()
        try {
          channelSelectMenu.addOptions([{ label: 'Channel hinzufügen', value: 'addChannel' }])
          for (const channel in channels) {
            const name = interaction.guild.channels.cache.get(channels[channel].id).name
            channelSelectMenu.addOptions([{ label: channels[channel].id, description: name, value: channel }])
          }
          const row = new ActionRowBuilder().addComponents(channelSelectMenu)
          prev.prev.interaction.editReply({
            components: [row]

          })
          unsub()
        } catch (e) {
          return null
        }
      })
    } catch {
      return null
    }
  }
}
