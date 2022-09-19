const { EmbedBuilder } = require('discord.js')
const { set, ref, getDatabase, get } = require('firebase/database')
const prev = require('./config')

/**
 * @file Select menu interaction: configBump
 * @since 1.0.0
*/
module.exports = {
  id: 'configBump',
  /**
* @description Executes when the select menu with ID configBump is called.

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
      if (interaction.values.includes('bumpChannel')) {
        interaction.reply({
          content: 'Bitte sende die Channel-ID',
          ephemeral: true
        })
        const msg = await collect()
        const channelID = msg.first().content
        await set(ref(db, id + '/bump/channel'), channelID)
        const bumpChannel = interaction.guild.channels.cache.get(`${JSON.stringify(await get(ref(db, id + '/bump/channel'))).slice(1, -1)}`)
        const bumpRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/bump/role'))).slice(1, -1)}`)
        const bumpEmbed = new EmbedBuilder()
          .setTitle('Bump Einstellungen')
          .addFields(
            { name: 'Bump Channel', value: String(bumpChannel) },
            { name: 'Bump Role', value: String(bumpRole) }
          )
        prev.prev.interaction.editReply({
          embeds: [bumpEmbed]
        })
        msg.first().delete()
      }
      if (interaction.values.includes('bumpRole')) {
        interaction.reply({
          content: 'Bitte erwähne die BumpRole',
          ephemeral: true
        })
        const msg = await collect()
        const roleID = msg.first().content.slice(3,-1)
        await set(ref(db, id + '/bump/role'), roleID)
        const bumpChannel = interaction.guild.channels.cache.get(`${JSON.stringify(await get(ref(db, id + '/bump/channel'))).slice(1, -1)}`)
        const bumpRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/bump/role'))).slice(1, -1)}`)
        const bumpEmbed = new EmbedBuilder()
          .setTitle('Bump Einstellungen')
          .addFields(
            { name: 'Bump Channel', value: String(bumpChannel) },
            { name: 'Bump Role', value: String(bumpRole) }
          )
        prev.prev.interaction.editReply({
          embeds: [bumpEmbed]
        })
        msg.first().delete()
      }
    } catch {
      return null
    }
  }
}
