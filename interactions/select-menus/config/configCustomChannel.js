const { StringSelectMenuBuilder, ActionRowBuilder, ChannelType } = require('discord.js')
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
    await interaction.deferReply({ ephemeral: true })
    const db = getDatabase()
    const id = interaction.guild.id
    let text = 'Bitte sende die Channel-ID oder erwähne den Channel.'
    async function config (text) {
      interaction.editReply({
        content: text,
        ephemeral: true
      })
      const msg = await collect(60000)
      let channelID
      if (msg.first().mentions.channels.first()) {
        channelID = msg.first().mentions.channels.first().id
      } else {
        channelID = msg.first().content
      }
      if (interaction.guild.channels.cache.get(channelID).type !== ChannelType.GuildVoice) {
        // call function again
        config('Dies ist kein VoiceChannel\nVersuche es erneut:\nBitte sende die Channel - ID oder erwähne den Channel.')
        msg.first().delete()
        return
      }
      interaction.editReply({
        content: 'Bitte gib an wie viele User standardmäßig in den Channel kommen dürfen.'
      })
      msg.first().delete()
      const msg2 = await collect(60000)
      const channelUsers = msg2.first().content
      interaction.editReply({
        content: 'Bitte gib den Standard Channel Namen an.\n Nutze `{user}` um den User Namen einzufügen.\n Nutze `{users}` um die Anzahl der User einzufügen.\n Nutze `{server}` um den Servernamen einzufügen.\n Nutze `{category}` um die Kategorie Namen einzufügen.'
      })
      msg2.first().delete()
      const msg3 = await collect(180000)
      const channelName = msg3.first().content
      msg3.first().delete()
      await set(ref(db, id + '/customChannels/' + channelID + '/id'), channelID)
      await set(ref(db, id + '/customChannels/' + channelID + '/users'), channelUsers)
      await set(ref(db, id + '/customChannels/' + channelID + '/name'), channelName)
      interaction.editReply({
        content: 'Der Channel wurde erfolgreich hinzugefügt.'
      })
    }
    function collect (time) {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1, time: time })
      return msg
    }
    try {
      try {
        prev.prev.interaction.editReply({
          components: [interaction.message.components[0]]
        })
      } catch {
        // do nothing
      }
      if (interaction.values.includes('addChannel')) {
        config(text)
      } else {
        remove(ref(db, id + '/customChannels/' + interaction.values[0]))
        interaction.reply({ content: 'Channel gelöscht!', ephemeral: true })
      }
      const channels = await ref(db, id + '/customChannels')
      const channelSelectMenu = new StringSelectMenuBuilder()
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
        } catch {
          // do nothing
        }
      })
    } catch {
      return null
    }
  }
}
